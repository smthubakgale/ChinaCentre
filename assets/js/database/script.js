let param = window.queryParam;

const url = d_config.url + `database/table?session=${encodeURIComponent(session)}&table=${param.table}`;

fetch(url)
.then((response) => response.json())
.then((data) => { 
    if(data.success){
        let tables = data.tables;
        let table = tables; // Assuming we only need the first table

        var tableHtml = createHtmlTable(table.columns.filter((column) => column.name !== "idx"));
        var filtersHtml = createHtmlFilters(table.columns.filter((column) => column.name !== "idx"));
        let bannerHtml = createHtmlBanner(param.table);

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
                            <div id="add-item-message"></div>
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

            let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
            let values = [];
            formData.forEach((value, key) => {
                if (columns.includes(key)) {
                    values.push(`'${value}'`);
                }
            });
            let query = `INSERT INTO ${param.table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
 
            // Send the form data to the server using fetch API
            fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
            .then((response) => { 
                return response.text()
            })
            .then((data) => {
                let result = JSON.parse(data);
                if(result.success){
                    // Clear the form
                    document.getElementById('add-item-form').reset();
                    // Add a success message
                    let successMessage = document.createElement('div');
                    successMessage.classList.add('alert', 'alert-success');
                    successMessage.innerHTML = 'Item added successfully!';
                    document.getElementById('add-item-message').appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                } else {
                    // Add an error message
                    let errorMessage = document.createElement('div');
                    errorMessage.classList.add('alert', 'alert-danger');
                    errorMessage.innerHTML = result.error;
                    document.getElementById('add-item-message').appendChild(errorMessage);
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error(error);
                // Add an error message
                let errorMessage = document.createElement('div');
                errorMessage.classList.add('alert', 'alert-danger');
                errorMessage.innerHTML = 'An error occurred!';
                document.getElementById('add-item-message').appendChild(errorMessage);
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            });
        });

        // Add a button to open the modal
        let addButtonHtml = `
            <button type="button" class="btn btn-primary" data-toggle="modal"  data-backdrop="false" data-target="#add-item-modal">Add New Item</button>
        `;
        document.getElementById('filter-container').innerHTML += addButtonHtml;

        // Append the table and filters to the page
        document.getElementById("banner-container").innerHTML = bannerHtml;
        document.getElementById("filter-container").innerHTML = filtersHtml;
        document.getElementById("table-container").innerHTML = tableHtml; 

        // Get the table element from the DOM
        let tableElement = document.getElementById('product-table');

        // Fetch table data
        let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
        let query = `SELECT ${columns.join(', ')} FROM ${param.table}`;
        let tableDataUrl = d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`;
        
        fetch(tableDataUrl)
        .then((response) => response.text())
        .then((data) => {
            let tableData = JSON.parse(data).data;
        
            // Load table data
            let tableBodyHtml = '';
            tableData.forEach((row) => {
                let rowHtml = '<tr>';
                columns.forEach((column, index) => {
                    rowHtml += `<td>${row[index]}</td>`;
                });
                rowHtml += '</tr>';
                tableBodyHtml += rowHtml;
            });
        
            // Append table data to the table
            document.getElementById('table-body').innerHTML = tableBodyHtml;

            // Update pagination numbers
            let totalCount = tableData.length;
            let limit = 10;
            let totalPages = Math.ceil(totalCount / limit);
            let paginationNumbersHtml = '';
            let currentPage = 1; // Assuming current page is 1

            if (totalPages <= 4) {
                for (let i = 0; i < totalPages; i++) {
                    paginationNumbersHtml += `<button>${i + 1}</button>`;
                }
            } else {
                paginationNumbersHtml += `<button>1</button>`;
                paginationNumbersHtml += `<button>2</button>`;
                paginationNumbersHtml += `...`;
                paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                paginationNumbersHtml += `<button>${totalPages}</button>`;
            }

            document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;

            // Add event listeners for pagination buttons
            document.getElementById('pagination-numbers').addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    let newPage = parseInt(e.target.textContent);
                    if (newPage === currentPage) return;

                    if (newPage === 1 || newPage === totalPages) {
                        // Update pagination numbers
                        paginationNumbersHtml = '';
                        if (newPage === 1) {
                            paginationNumbersHtml += `<button>1</button>`;
                            paginationNumbersHtml += `<button>2</button>`;
                            paginationNumbersHtml += `...`;
                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                        } else {
                            paginationNumbersHtml += `<button>1</button>`;
                            paginationNumbersHtml += `<button>2</button>`;
                            paginationNumbersHtml += `...`;
                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                        }
                        document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
                    } else {
                        // Update current page
                        currentPage = newPage;
                        // Update pagination numbers
                        paginationNumbersHtml = '';
                        paginationNumbersHtml += `<button>${currentPage - 1}</button>`;
                        paginationNumbersHtml += `<button>${currentPage}</button>`;
                        paginationNumbersHtml += `<button>${currentPage + 1}</button>`;
                        document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
                    }
                }
            });

            // Add event listeners for next and prev buttons
            document.getElementById('next-btn').addEventListener('click', () => {
                let newPage = currentPage + 1;
                if (newPage > totalPages) return;
                currentPage = newPage;
                // Update pagination numbers
                paginationNumbersHtml = '';
                if (currentPage === totalPages) {
                    paginationNumbersHtml += `<button>${totalPages - 3}</button>`;
                    paginationNumbersHtml += `<button>${totalPages - 2}</button>`;
                    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                    paginationNumbersHtml += `<button>${totalPages}</button>`;
                } else {
                    paginationNumbersHtml += `<button>${currentPage - 1}</button>`;
                    paginationNumbersHtml += `<button>${currentPage}</button>`;
                    paginationNumbersHtml += `<button>${currentPage + 1}</button>`;
                }
                document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
            });

            document.getElementById('prev-btn').addEventListener('click', () => {
                let newPage = currentPage - 1;
                if (newPage < 1) return;
                currentPage = newPage;
                // Update pagination numbers
                paginationNumbersHtml = '';
                if (currentPage === 1) {
                    paginationNumbersHtml += `<button>1</button>`;
                    paginationNumbersHtml += `<button>2</button>`;
                    paginationNumbersHtml += `...`;
                    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                    paginationNumbersHtml += `<button>${totalPages}</button>`;
                } else {
                    paginationNumbersHtml += `<button>${currentPage - 1}</button>`;
                    paginationNumbersHtml += `<button>${currentPage}</button>`;
                    paginationNumbersHtml += `<button>${currentPage + 1}</button>`;
                }
                document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
            });
        })
        .catch((error) => {
            console.error(error);
        });
    } else {
        console.error(data.error);
    }
})
.catch((error) => {
    console.error(error);
});					
