
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

        var tableHtml = createHtmlTable(table.columns);
        var filtersHtml = createHtmlFilters(table.columns);
        let bannerHtml = createHtmlBanner(param.table);

        console.log(tableHtml);
        console.log(filtersHtml);

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
