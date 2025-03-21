
console.log(window.queryParam); 

//: 
let param = window.queryParam;

const url = d_config.url + `database/table?session=${encodeURIComponent(session)}&table=${param.table}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.log(data);
    if(data.success){
        let tables = data.tables;
        let table = tables; // Assuming we only need the first table

        var tableHtml = createHtmlTable(table.columns.filter((column) => column.name !== "idx"));
        var filtersHtml = createHtmlFilters(table.columns.filter((column) => column.name !== "idx"));
        let bannerHtml = createHtmlBanner(param.table);

        console.log(tableHtml);
        console.log(filtersHtml); 
        // Create the modal HTML
        let modalHtml = `
            <div class="modal fade" id="add-item-modal" tabindex="-1" role="dialog" aria-labelledby="add-item-modal-label" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="add-item-modal-label">Add New Item</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="add-item-form">
                                <!-- Form fields will be generated dynamically here -->
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="add-item-btn">Add Item</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the modal HTML to the page
        document.body.innerHTML += modalHtml;
        
        function generateFormFields(columns) {
            let formFieldsHtml = '';
            columns.forEach((column) => {
                let fieldName = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                let fieldType = getFieldType(column.type , column);
        
                formFieldsHtml += `
                    <div class="form-group">
                        <label for="${column.name}">${fieldName}</label>
                        ${fieldType}
                    </div>
                `;
            });
            return formFieldsHtml;
        }
        
        function getFieldType(columnType , column) {
            switch (columnType) {
                case 'INT':
                    return `<input type="number" class="form-control" id="${column.name}" name="${column.name}">`;
                case 'NVARCHAR(255)':
                    return `<input type="text" class="form-control" id="${column.name}" name="${column.name}">`;
                case 'DECIMAL(10, 2)':
                    return `<input type="number" step="0.01" class="form-control" id="${column.name}" name="${column.name}">`;
                case 'BIT':
                    return `<select class="form-control" id="${column.name}" name="${column.name}"><option value="0">No</option><option value="1">Yes</option></select>`;
                default:
                    return `<input type="text" class="form-control" id="${column.name}" name="${column.name}">`;
            }
        }
        
        // Generate the form fields dynamically and add them to the form
        let formFieldsHtml = generateFormFields(table.columns.filter((column) => column.name !== "idx"));
        document.getElementById('add-item-form').innerHTML = formFieldsHtml;
        
        // Add an event listener to the add item button
        document.getElementById('add-item-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Get the form data and send it to the server to add the new item
            let formData = new FormData(document.getElementById('add-item-form'));
            // Send the form data to the server using fetch API
            fetch('/add-item', {
                method: 'POST',
                body: formData
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Close the modal and refresh the table
                $('#add-item-modal').modal('hide');
                // Refresh the table here
            })
            .catch((error) => {
                console.error(error);
            });
        });
        
        // Add a button to open the modal
        let addButtonHtml = `
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-item-modal" data-backdrop="false">Add New Item</button>
        `;
        document.getElementById('filter-container').innerHTML += addButtonHtml;
                // Append the table and filters to the page
                document.getElementById("banner-container").innerHTML = bannerHtml;
                document.getElementById("filter-container").innerHTML = filtersHtml;
                document.getElementById("table-container").innerHTML = tableHtml;
            }

    function createHtmlBanner(tableName) {
        // Adjust the table name like the columns
        let bannerText = tableName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    
        // Create the banner
        let banner = `
            <div class="banner">
                <h1>${bannerText}</h1>
            </div>
        `;
    
        return banner;
    }

    function createHtmlTable(columns) {
        // Create the table header
        let tableHeader = '<tr>';
        columns.forEach((column) => {
            // Modify the column text to make it more readable
            let columnHeader = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            tableHeader += `<th>${columnHeader}</th>`;
        });
        
        tableHeader += `<th>Actions</th>`; // Add the "Actions" column
        tableHeader += '</tr>';

        // Create the table
        let table = `<table class="table table-striped" id="product-table">${tableHeader}</table>`;

        return table;
    }

    function createHtmlFilters(columns) {
        let filtersHtml = `
            <form>
                <div class="form-row">
        `;

        columns.forEach((column) => {
            let filterName = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            filtersHtml += `
                <div class="form-group col-md-3">
                    <label for="${column.name}">${filterName}</label>
                    <input type="text" class="form-control" id="${column.name}" placeholder="${filterName}">
                </div>
            `;
        });

        filtersHtml += `
                </div>
                <button type="button" class="btn btn-primary" id="apply-filter">Apply Filter</button>
                <button type="button" class="btn btn-secondary" id="reset-filter">Reset Filter</button>
            </form>
        `;

        return filtersHtml;
    }
})
.catch((error) => {
    console.error(error);
});
