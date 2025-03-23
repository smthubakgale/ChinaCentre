let param = window.queryParam;

const url2 = d_config.url + `database/table?session=${encodeURIComponent(session)}&table=${param.table}`;

fetch(url2)
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
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the modal HTML to the page
        document.body.innerHTML += modalHtml;

	// Create the modal HTML
	let updateModalHtml = `
	    <div class="modal fade" id="update-item-modal" tabindex="-1" role="dialog" aria-labelledby="update-item-modal-label" aria-hidden="true">
	        <div class="modal-dialog" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <h5 class="modal-title" id="update-item-modal-label">Update Item</h5>
	                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	                        <span aria-hidden="true">&times;</span>
	                    </button>
	                </div>
	                <div class="modal-body">
	                    <form id="update-item-form">
	                        <!-- Form fields will be generated dynamically here -->
	                    </form>
	                </div>
	                <div class="modal-footer">
	                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	                    <button type="submit" class="btn btn-primary" id="update-item-btn">Update Item</button>
	                </div>
	            </div>
	        </div>
	    </div>
	`;
	// Add the modal HTML to the page
	document.body.innerHTML += updateModalHtml;

	// Create the modal HTML
	let deleteModalHtml = `
	    <div class="modal fade" id="delete-item-modal" tabindex="-1" role="dialog" aria-labelledby="delete-item-modal-label" aria-hidden="true">
	        <div class="modal-dialog" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <h5 class="modal-title" id="delete-item-modal-label">Delete Item</h5>
	                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	                        <span aria-hidden="true">&times;</span>
	                    </button>
	                </div>
	                <div class="modal-body">
	                    Are you sure you want to delete this item?
	                </div>
	                <div class="modal-footer">
	                    <button type="button" class="btn btn-secondary" id="cancel-delete-item-btn">Cancel</button>
	                    <button type="button" class="btn btn-danger" id="delete-item-btn">Delete</button>
	                </div>
	            </div>
	        </div>
	    </div>
	`;
	// Add the modal HTML to the page
	document.body.innerHTML += deleteModalHtml;
        
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
                return response.json();
            })
            .then((data) => {
                console.log(data); 
                if(data.success){
                    // Clear the form
                    document.getElementById('add-item-form').reset();
                    // Add a success message
                    let successMessage = document.createElement('div');
                    successMessage.classList.add('alert', 'alert-success');
                    successMessage.innerHTML = 'Item added successfully!';
                    document.getElementById('add-item-btn').parentNode.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                } else {
                    // Add an error message
                    let errorMessage = document.createElement('div');
                    errorMessage.classList.add('alert', 'alert-danger');
                    errorMessage.innerHTML = data.message;
                    document.getElementById('add-item-btn').parentNode.appendChild(errorMessage);
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        });
        
        // Add a button to open the modal
        let addButtonHtml = `
            <button type="button" class="btn btn-primary" data-toggle="modal"  data-backdrop="false" data-target="#add-item-modal">Add New Item</button>
        `;
        document.getElementById('filter-container').innerHTML += addButtonHtml;
        // Append the table and filters to the page
        document.getElementById("banner-container").innerHTML = bannerHtml;
        document.getElementById("filter-container").innerHTML += filtersHtml;
        document.getElementById("table-container").innerHTML = tableHtml; 
 
        let whereClause = '';
	// Add event listener for apply filter button
	console.log(filtersHtml);
	document.querySelector('#filter-container #apply-filter').addEventListener('click', () => 
	{
	   console.log("Apply");
	    // Initialize the filter conditions
	    let filterConditions = '';
	
	    // Get the column names
	    let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
	
	    // Loop through the columns
	    columns.forEach((column, index) => {
	        // Get the input value
	        let inputValue = document.querySelector(`#filter-container #${column}`).value;
	
	        // Check if the value is not empty
	        if (inputValue !== '') {
	            // Add the condition to the filter conditions
	            if (filterConditions !== '') {
	                filterConditions += ' OR ';
	            }
	            filterConditions += `LOWER(${column}) LIKE '%${inputValue.toLowerCase()}%'`;
	        }
	    });
	 
	    if (filterConditions !== '') {
	        whereClause = ` WHERE ${filterConditions}`;
	    }
	
	    offset = 0;
	    currentPage = 1;
	    updatePaginationNumbers();
	    fetchTableData();
	});
	// Add event listener for reset filter button
	document.querySelector('#filter-container #reset-filter').addEventListener('click', () => {
	    console.log("reset filter");
	    // Get the filter container elements
	    let filterContainerElements = document.querySelectorAll('#filter-container input, #filter-container select, #filter-container textarea');

	    console.log(filterContainerElements);
	    // Loop through the filter container elements and reset their values
	    filterContainerElements.forEach((element) => {
	        if (element.type === 'checkbox' || element.type === 'radio') {
	            element.checked = false;
	        } else if (element.tagName === 'SELECT') {
	            element.selectedIndex = 0;
	        } else {
	            element.value = '';
	        }
	    });

	    whereClause = '';
		
	    offset = 0;
	    currentPage = 1;
	    updatePaginationNumbers();
	    fetchTableData();
	});
        // Get the table element from the DOM
        let tableElement = document.getElementById('product-table');

        // Fetch total count of records
        let countUrl = d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(`SELECT COUNT(*) FROM ${param.table} ${whereClause}`)}`;
        fetch(countUrl)
        .then((response) => response.json())
        .then((data) => { 
            if(data.success && data.results){
                let totalCount = data.results.recordset[0][''];
                
                // Create select tag for limit
                let limitSelectHtml = `
                    <select id="limit-select">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                `;
                document.getElementById("filter-container").innerHTML += limitSelectHtml;

                // Set default limit and offset
                let limit = 10;
                let offset = 0;
				let currentPage = 1;
                let totalPages = Math.ceil(totalCount / limit);

                // Add event listener to limit select tag
                document.getElementById('limit-select').addEventListener('change', (e) => {
                    limit = parseInt(e.target.value);
                    offset = 0;
		    currentPage = 1;
		    updatePaginationNumbers();
                    fetchTableData();
                });

                // Add pagination buttons
                let paginationHtml = `
                    <div class="pagination">
                        <button id="prev-button">&laquo;</button>
                        <div id="pagination-numbers"></div>
                        <button id="next-button">&raquo;</button>
                    </div>
                `;
                document.getElementById("table-container").innerHTML += paginationHtml;

                // Add event listeners to pagination buttons
		document.getElementById('prev-button').addEventListener('click', () => {
			if (offset >= limit) {
				offset -= limit;
				currentPage -= 1;
				updatePaginationNumbers();
				fetchTableData();
			}
		});

		document.getElementById('next-button').addEventListener('click', () => {
			if (offset + limit < totalCount) {
				offset += limit;
				currentPage += 1;
				updatePaginationNumbers();
				fetchTableData();
			}
		});

		function updatePaginationNumbers() {
		    let paginationNumbersHtml = '';
		    if (totalPages <= 4) {
			for (let i = 0; i < totalPages; i++) {
			    if (i + 1 === currentPage) {
				paginationNumbersHtml += `<button class="active">${i + 1}</button>`;
			    } else {
				paginationNumbersHtml += `<button>${i + 1}</button>`;
			    }
			}
		    } else {
			if (currentPage === 1) {
			    paginationNumbersHtml += `<button class="active">1</button>`;
			    paginationNumbersHtml += `<button>2</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
			    paginationNumbersHtml += `<button>${totalPages}</button>`;
			} else if (currentPage === totalPages) {
			    paginationNumbersHtml += `<button>1</button>`;
			    paginationNumbersHtml += `<button>2</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
			    paginationNumbersHtml += `<button class="active">${totalPages}</button>`;
			} else if (currentPage === 2) {
			    paginationNumbersHtml += `<button>1</button>`;
			    paginationNumbersHtml += `<button class="active">2</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
			    paginationNumbersHtml += `<button>${totalPages}</button>`;
			} else if (currentPage === totalPages - 1) {
			    paginationNumbersHtml += `<button>1</button>`;
			    paginationNumbersHtml += `<button>2</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button class="active">${totalPages - 1}</button>`;
			    paginationNumbersHtml += `<button>${totalPages}</button>`;
			} else {
			    paginationNumbersHtml += `<button>1</button>`;
			    paginationNumbersHtml += `<button>2</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button class="active">${currentPage}</button>`;
			    paginationNumbersHtml += `...`;
			    paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
			    paginationNumbersHtml += `<button>${totalPages}</button>`;
			}
		    }
		    document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
		}

                function fetchTableData() {
                    let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
                    let columns_all = table.columns.map(column => column.name);
		    let query = `SELECT ${columns_all.join(', ')} FROM ${param.table} ${whereClause} ORDER BY idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
                    let tableDataUrl = d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`;

		    console.log(query);
			
                    fetch(tableDataUrl)
                    .then((response) => response.json())
                    .then((data) => { 
                        if(data.success && data.results){
                            let tableData = data.results.recordset;

                            // Load table data
                            let tableBodyHtml = '';
                            tableData.forEach((row) => {
                                console.log(row);
                                
                                let rowHtml = '<tr>';
                                columns.forEach((column, index) => {
                                    console.log(column , row[column]);
                                    
                                    rowHtml += `<td>${row[column]}</td>`;
                                });

                                // Add extra column for delete and update buttons
                                rowHtml += `<td>
                                    <button class="btn btn-danger" id="delete-btn-${row['idx']}">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button class="btn btn-primary"  data-toggle="modal"  data-backdrop="false" data-target="#update-item-modal" id="update-btn-${row['idx']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>`;

                                rowHtml += '</tr>';
                                tableBodyHtml += rowHtml;
                            });

                            // Append table data to the table
                            let tableBody = document.getElementById('table-body');
                            tableBody.innerHTML = tableBodyHtml; 
				
                            console.log(tableElement);
				
			    console.log(tableBody);

                            // Add event listeners for delete and update buttons 
                            tableData.forEach((row) => {
                                document.getElementById(`delete-btn-${row['idx']}`).addEventListener('click', () => {
                                    deleteRow(row['idx']);
                                });

                                document.getElementById(`update-btn-${row['idx']}`).addEventListener('click', () => {
			            console.log(row['idx']);
                                    updateRow(row['idx']);
                                });
                            });
			 

                            // Add event listeners to pagination numbers 
			       document.querySelectorAll('#pagination-numbers button').forEach((button) => {
				     button.addEventListener('click', (e) => {
					e.preventDefault();
					let newPage = parseInt(button.textContent);
					if (newPage === currentPage) return;
					offset = (newPage - 1) * limit;
					currentPage = newPage;
					updatePaginationNumbers();
					fetchTableData();
				     });
				});
				// Function to update a row
				function updateRow(idx) {
				    // Get the row data
				    let rowData = tableData.find((row) => row['idx'] === idx);

				    console.log(rowData);
				
				    // Generate the form fields dynamically
				    let formFieldsHtml = '';
				    table.columns.forEach((column) => {
				        if (column.name !== 'idx') {
				            let fieldName = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
				            let fieldType = getFieldType(column.type, column);
				            formFieldsHtml += `
				                <div class="form-group">
				                    <label for="${column.name}">${fieldName}</label>
				                    ${fieldType}
				                </div>
				            `;
				        }
				    });
				
				    // Add the form fields to the modal
				    document.getElementById('update-item-form').innerHTML = formFieldsHtml;
				
				    // Populate the form fields with the row data
				    table.columns.forEach((column) => {
				        if (column.name !== 'idx') {
				            document.querySelector(`#update-item-modal #${column.name}`).value = rowData[column.name];
				        }
				    });
				
				    // Add the idx property to the modal
				    document.getElementById('update-item-modal').idx = idx;
				
				    // Show the modal
				    document.getElementById('update-item-modal').style.display = 'block';
				    document.getElementById('update-item-modal').classList.add('show');
				    //
				}
				
				// Add event listener for update item button
				document.getElementById('update-item-btn').addEventListener('click', (e) => {
				    e.preventDefault();
				    // Get the idx from the modal
				    let idx = document.getElementById('update-item-modal').idx;
				
				    // Get the form data
				    let formData = new FormData(document.getElementById('update-item-form'));
				
				    // Generate the update query
				    let query = `UPDATE ${param.table} SET `;
				    table.columns.forEach((column, index) => {
				        if (column.name !== 'idx') {
				            query += `${column.name} = '${formData.get(column.name)}'`;
				            if (index < table.columns.length - 2) {
				                query += ', ';
				            }
				        }
				    });
				    query += ` WHERE idx = ${idx}`;
				
				    // Send the update query to the server
				    fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
				    .then((response) => response.json())
				    .then((data) => {
				        console.log(data);
				        if (data.success) {
				            // Update the table data
				            fetchTableData();
				            // Hide the modal
				            document.getElementById('update-item-modal').style.display = 'none';
				        } else {
				            console.error(data.message);
				        }
				    })
				    .catch((error) => {
				        console.error(error);
				    });
				});

				// Function to delete a row
				function deleteRow(idx) {
				    // Set the idx property to the modal
				    document.getElementById('delete-item-modal').idx = idx;
				
				    // Show the modal
				    document.getElementById('delete-item-modal').style.display = 'block';
				    document.getElementById('delete-item-modal').classList.add('show');
				}
				
				// Add event listener for delete item button
				document.getElementById('delete-item-btn').addEventListener('click', (e) => {
				    e.preventDefault();
				    // Get the idx from the modal
				    let idx = document.getElementById('delete-item-modal').idx;
				
				    // Generate the delete query
				    let query = `DELETE FROM ${param.table} WHERE idx = ${idx}`;
				
				    // Send the delete query to the server
				    fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
				    .then((response) => response.json())
				    .then((data) => {
				        console.log(data);
				        if (data.success) {
				            // Update the table data
				            fetchTableData();
				            // Hide the modal
				            document.getElementById('delete-item-modal').style.display = 'none';
				        } else {
				            console.error(data.message);
				        }
				    })
				    .catch((error) => {
				        console.error(error);
				    });
				});
				
				// Add event listener for cancel button
				document.getElementById('cancel-delete-item-btn').addEventListener('click', () => {
				    // Hide the modal
				    document.getElementById('delete-item-modal').style.display = 'none';
				});
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }

                // Fetch table data
		        updatePaginationNumbers();
                fetchTableData();
            }
        })
        .catch((error) => {
            console.error(error);
        });
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
	    let table = `
	        <table class="table table-striped" id="product-table">
	            <thead>${tableHeader}</thead>
	            <tbody id="table-body"></tbody>
	        </table>
	    `;
	
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
					
