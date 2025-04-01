setTimeout(function()
{
	let param = window.queryParam;

	const url2 = d_config.url + `database/table?session=${encodeURIComponent(session)}&table=${param.table}`;
	
	fetch(url2)
	.then((response) => response.json())
	.then((data) => { 
	    if(data.success){
	        let tables = data.tables;
		window.mtable = tables;
	        let table = tables; // Assuming we only need the first table
	
	        var tableHtml = createHtmlTable(table.columns.filter((column) => column.name !== "idx" && column.form != "none") );
	        var filtersHtml = createHtmlFilters(table.columns.filter((column) => column.name !== "idx" && column.form != "none"));
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
		let fileManagementModalHtml = `
		    <div class="modal fade" id="file-management-modal" tabindex="-1" role="dialog" aria-labelledby="file-management-modal-label" aria-hidden="true">
		        <div class="modal-dialog modal-lg" role="document">
		            <div class="modal-content">
		                <div class="modal-header">
		                    <h5 class="modal-title" id="file-management-modal-label">File Management</h5>
		                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                        <span aria-hidden="true">&times;</span>
		                    </button>
		                </div>
		                <div class="modal-body">
		                    <ul class="nav nav-tabs" id="file-management-tabs" role="tablist">
				      ${table.image ? `<li class="nav-item"><button class="tab-btn active" id="image-tab" data-toggle="tab" href="#image" role="tab" aria-controls="image" aria-selected="true">Image</button></li>` : ''}
				      ${table.gallery ? `<li class="nav-item"><button class="tab-btn" id="gallery-tab" data-toggle="tab" href="#gallery" role="tab" aria-controls="gallery" aria-selected="false">Gallery</button></li>` : ''}
				    </ul>
		                    <div class="tab-content" id="file-management-tab-content">
		                        ${table.image ? `
		                            <div class="tab-pane fade show active" id="image" role="tabpanel" aria-labelledby="image-tab">
		                                <input type="file" id="image-input" accept="image/*" gallery="NO" onchange="uploadImage(this)" style="display:none" />
		                                <button class="btn btn-primary" id="image-upload-btn" onclick="this.parentNode.querySelector('#image-input').click()">Upload Image</button>
		                                <div id="image-preview"></div>
		                                <button class="btn btn-danger" id="image-delete-btn" style="display:none" >Delete Image</button>
		                            </div>
		                        ` : ''}
		                        ${table.gallery ? `
		                            <div class="tab-pane fade" id="gallery" role="tabpanel" aria-labelledby="gallery-tab">
		                                <input type="file" id="gallery-input" accept="image/*, video/*" gallery="YES" onchange="uploadImage(this)" style="display:none;" />
		                                <button class="btn btn-primary" id="gallery-upload-btn" onclick="this.parentNode.querySelector('#gallery-input').click()">Upload Files</button>
		                                <div id="gallery-preview"></div>
		                                <ul id="gallery-list"></ul>
		                            </div>
		                        ` : ''}
		                    </div>
		                </div>
		                <div class="modal-footer">
		                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		                </div>
		            </div>
		        </div>
		    </div>
		`;
		// Add the modal HTML to the page
		document.body.innerHTML += fileManagementModalHtml;
	
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

			console.log(column); 
			    
			if(column.form == "select" && column.filter){
				formFieldsHtml += `
		                <div class="form-group">
		                    <label for="${column.name}">${fieldName}</label>
		                    <select class="form-control" id="${column.name}" name="${column.name}" placeholder="${fieldName}">
			            </select>
		                </div>
		                `;
			}
		        else {
		                formFieldsHtml += `
		                    <div class="form-group">
		                        <label for="${column.name}">${fieldName}</label>
		                        <input type="text" class="form-control" id="${column.name}" name="${column.name}">
		                    </div>
		                `;
			}
	            });
	            return formFieldsHtml;
	        }  
	        // Generate the form fields dynamically and add them to the form
	        let formFieldsHtml = generateFormFields(table.columns.filter((column) => column.name !== "idx"));
	        document.getElementById('add-item-form').innerHTML = formFieldsHtml;
	        document.getElementById('update-item-form').innerHTML = formFieldsHtml;
		 
	        // Add an event listener to the add item button
	        document.getElementById('add-item-btn').addEventListener('click', (e) => {
	            e.preventDefault();
	            // Get the form data and send it to the server to add the new item
		    let doc = document.getElementById('add-item-form');
	            let formData = new FormData(doc);

		    console.log(doc); 
		    console.log(formData);

		    const fks = [];
		    doc.querySelectorAll("[tab]:not([tab='null']):not([tab=''])").forEach((fk) => {
		       if (fk.hasAttribute("col") && fk.hasAttribute("refcol") && fk.hasAttribute("tab") && fk.hasAttribute("id")) {
		        fks.push({
		          col: fk.getAttribute("col"),
		          refcol: fk.getAttribute("refcol"),
		          tab: fk.getAttribute("tab"),
		          id: fk.getAttribute("id")
		        });
		       }
		    });

		    console.log(fks); 
 
	            let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
	            let values = [];
		    let tables = [];
		    let exists = [];
			
	            formData.forEach((value, key) => {
	                if (columns.includes(key))
			{
			    console.log(fks , key);
			    var fs = fks.filter(item => item.id == key);
			    console.log(fs);

			    if(fs.length > 0){
				values.push(`d${values.length + 1}.${fs[0].refcol}`);    
				tables.push(`${fs[0].tab} d${values.length}`);
				exists.push(`EXISTS (
		                        SELECT 1
		                        FROM ${fs[0].tab} c${values.length} 
		                        WHERE c${values.length}.${fs[0].col} = '${value}' AND d${values.length}.${fs[0].refcol} = c${values.length}.${fs[0].refcol}
		                )`);
			    }
			    else{
				values.push(`'${value}'`);    
			    } 
	                }
	            });
	            let query = null;
			
		    if(fks.length == 0)
		    {
			 query = `INSERT INTO ${param.table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
		    }
		    else {
			 query = `INSERT INTO ${param.table} (${columns.join(', ')}) 
                                  SELECT ${values.join(', ')}
                                  FROM ${tables.join(', ')}
				  WHERE ${exists.join('AND ')}`   
		    }

		    console.log(query);

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
				    
				    updateCount(()=>
				    {
				       updatePaginationNumbers();
				       fetchTableData(); 
				    });
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
	        document.getElementById("banner-container").innerHTML = bannerHtml;
	        document.getElementById("filter-container").innerHTML = filtersHtml;
	        document.getElementById("table-container").innerHTML = tableHtml; 

		setTimeout(function(){
		   generateFormSearch(table.columns.filter((column) => column.name !== "idx"));
		},500);
		    
	        let whereClause = '';
		// Add event listener for apply filter button
		console.log(filtersHtml);
		window.applyFilter = function()  
		{
		   console.log("Apply");
		    // Initialize the filter conditions
		    let filterConditions = '';
		
		    // Get the column names
		    let columns = table.columns.filter((column) => column.name !== "idx" && column.form != "none");
		
		    // Loop through the columns
		    columns.forEach((column, index) => {
		        // Get the input value
		        let inputValue = document.querySelector(`#filter-container #${column.name}`);
			console.log(column.name);
			console.log(inputValue);
			inputValue = inputValue ? inputValue.value : inputValue;
			console.log(inputValue);
		
		        // Check if the value is not empty
		        if (inputValue && inputValue !== '') {
		            // Add the condition to the filter conditions
		            if (filterConditions !== '') {
		                filterConditions += ' OR ';
		            }

			    console.log(column.name);
			    console.log(column.filter); 

			    if(column.filter){
				var fks = table.constraints.filter(item => item.type == "foreignKey" &&
				                                               item.columns.includes(column.name) );
			        var fs = fks.filter(item => item.columns.includes(column.name));
			        console.log(fs);

			        if(fs.length > 0){
				    filterConditions += `EXISTS (
	                                SELECT 1 
				        FROM ${fs[0].referencedTable} e 
	                                WHERE LOWER(e.${column.filter}) LIKE '%${inputValue.toLowerCase()}%' AND 
				              ${param.table}.${column.name} = e.${fs[0].referencedColumns[0]}
				    )`;
			        }
			        else {
				    filterConditions += `LOWER(${column.name}) LIKE '%${inputValue.toLowerCase()}%'`;   
			        }
			    }
			    else {
				filterConditions += `LOWER(${column.name}) LIKE '%${inputValue.toLowerCase()}%'`;    
			    } 
		        }
		    });
		 
		    if (filterConditions !== '') {
		        whereClause = ` WHERE ${filterConditions}`;
		    }

		    console.log(whereClause);
		
		    updateCount(()=>
		    {
		       updatePaginationNumbers();
		       fetchTableData(); 
		    });
		}
		// Add event listener for reset filter button
		window.resetFilter = function(){
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
		    updateCount(()=>
		    {
		       updatePaginationNumbers();
		       fetchTableData(); 
		    });
		}
	        // Get the table element from the DOM
	        let tableElement = document.getElementById('product-table');
	
		window.updateCount = function(callback = ()=>{}) {
		    // Fetch total count of records
		    let query = `SELECT COUNT(*) FROM ${param.table} ${whereClause}`;
		    console.log(query); 
		    let countUrl = d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`;
		    fetch(countUrl)
		    .then((response) => response.json())
		    .then((data) => { 
		        if(data.success && data.results){
		            let totalCount = data.results.recordset[0][''];
		            
		            // Set default limit and offset
		            window.limit = 10;
		            window.offset = 0;
		            window.currentPage = 1;
		            window.totalPages = Math.ceil(totalCount / limit);
		
		            // Call the callback function
		            callback();
		        }
		    })
		    .catch((error) => {
		        console.error(error);
		        callback();
		    });
		}
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
			document.querySelector('#filter-container #apply-filter').addEventListener('click', () => {
				console.log("A");
			});
	
	                // Set default limit and offset
	                window.limit = 10;
	                window.offset = 0;
			window.currentPage = 1;
	                window.totalPages = Math.ceil(totalCount / limit);
	
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
	                //document.getElementById("table-container").innerHTML += paginationHtml;
			document.getElementById("table-container").insertAdjacentHTML('afterend', paginationHtml);
	
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
	
			window.updatePaginationNumbers = function() {
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
	
	                window.fetchTableData = function () {
	                    let columns = table.columns.filter((column) => column.name !== "idx" && column.form != "none").map(column => column.name);
	                    let columns_all = table.columns.filter((column) => column.form != "none").map(column => column.name);
			    let query = null;
		
			    if(table.columns.filter(column => column.filter).length > 0){
		 
                               let values = [];
		               let tables = [`${param.table} b`];
		               let exists = [];
				    
			       table.columns.filter(column => column.form != "none").forEach((column) => {
			                  
			            var fks = table.constraints.filter(item => item.type == "foreignKey" &&
				                                               item.columns.includes(column.name) );
				    var fs = fks.filter(item => item.columns.includes(column.name));
				    console.log(fs);
	
				    if(fs.length > 0){
					values.push(`d${values.length + 1}.${column.filter} AS ${column.name}`);    
					tables.push(`${fs[0].referencedTable} d${values.length}`);
					exists.push(`b.${column.name} = d${values.length}.${fs[0].referencedColumns[0]}`);
				    }
				    else{
					values.push(`b.${column.name} AS ${column.name}`);    
				    }  
			        });

				query = `SELECT ${values.join(', ')}
                                  FROM ${tables.join(', ')}
				  ${whereClause.replace(`${param.table}.` , 'b.')} ${exists.length > 0 ? (whereClause.trim() == '' ? ' WHERE ' : ' AND ')+exists.join('AND ') : ''}
                                  ORDER BY b.idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`; 
			    }
		            else {				
			        query = `SELECT ${columns_all.join(', ')} 
				  FROM ${param.table} 
				  ${whereClause} 
				  ORDER BY idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;    
			    }
	
	                    console.log(query);

			    //return; 
				
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
	                                    <button class="btn btn-primary" data-toggle="modal"  data-backdrop="false" data-target="#update-item-modal" id="update-btn-${row['idx']}">
	                                        <i class="fas fa-edit"></i>
	                                    </button>`;
	
					if(table.gallery == true || table.image == true)
					{
	                                    rowHtml += `
					        <button class="btn btn-warning" data-toggle="modal"  data-backdrop="false" data-target="#file-management-modal" " id="files-btn-${row['idx']}">
					         <i class="fas fa-file"></i>
					        </button>`;
					}
	
					rowHtml += `
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
	                                var deletes = document.getElementById(`delete-btn-${row['idx']}`);
					if(deletes)
					{
					   deletes.addEventListener('click', () => {
	                                      deleteRow(row['idx']);
	                                   }); 
					}
	
	                                var updates =  document.getElementById(`update-btn-${row['idx']}`);
				        if(updates)
					{
					   updates.addEventListener('click', () => { 
	                                      updateRow(row['idx']);
	                                   });
					}
										    
	                                var files = document.getElementById(`files-btn-${row['idx']}`);
					if(files)
					{ 
					    files.addEventListener('click', () => {
				               console.log(row['idx']);
					       manageFiles(row['idx']);
	                                    });	
					}
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
					// Function to manage files 
					function manageFiles(idx) 
					{
					    console.log("Manage Files");
					    let imageInput = document.querySelector('#file-management-modal '
							   + '#image ' 
							   + 'input[type="file"]');
					    if (imageInput) {
					        imageInput.setAttribute('idx', idx);
					    }
						
					    let galleryInput = document.querySelector('#file-management-modal '
							   + '#gallery ' 
							   + 'input[type="file"]');
					    if (galleryInput) {
					        galleryInput.setAttribute('idx', idx);
					    }
						
					    let tableName = param.table;
					    var img_prev = '#file-management-modal #image #image-preview';
					    var img_del = '#file-management-modal #image #image-delete-btn';
					    var img_upd = '#file-management-modal #image #image-upload-btn';
					    var list = '#file-management-modal #gallery #gallery-list';
					    var gal_prev = '#file-management-modal #gallery #gallery-preview';

					    document.querySelector(img_prev).innerHTM = '';
					    try{
						 document.querySelector(list).innerHTML = '';
					         document.querySelector(gal_prev).innerHTML = '';
					    }catch{}
				            let isFirst = true;

					    console.log('request file list');
					    fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=${tableName}&tableIdx=${idx}`)
					      .then(response => response.json())
					      .then((data) => {

						      var proc = true;
						      if(data.recordset){
							   console.log(data.recordset);
							      
							   data.recordset.forEach((item)=>
							   {     
							      try{
								     if(item.file_name && item.file_size && item.gallery == "NO" && proc)
								      {
									 proc = false;
									 const image = document.createElement('img');
									 image.width = 200;
									 image.height = 200;
									 image.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
									 document.querySelector(img_prev).innerHTML = image.outerHTML;
									 document.querySelector(img_prev).style.display = "block";
	
									 const uploadButton = document.querySelector(img_upd);
									 uploadButton.style.display = "none";
									 const deleteButton = document.querySelector(img_del);
									 deleteButton.style.display = "block";
	
									 deleteButton.addEventListener('click' , ()=>
									 {
									      let button = document.getElementById('delete-item-modal');
									      
									      button.setAttribute('idx', item.idx);
									      button.setAttribute('table_name', tableName);
									      button.setAttribute('table_idx', idx);  
									      deleteFile(); 
									 });
									 
								      }      
							      } catch(err){ console.error(err); }
							       
							      try{
								      if(item.file_name && item.file_size && item.gallery == "YES")
								      {
									   const li = document.createElement('li');
									   li.style.display = 'flex';
	
									   const fileNameP = document.createElement('p');
									   fileNameP.textContent = item.file_name;
									
									   const fileSizeP = document.createElement('p');
									   fileSizeP.textContent = formatFileSize(item.file_size);
	 
									   const deleteButton = document.createElement('button');
									   deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
									   deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
	 
									   deleteButton.addEventListener("click" , ()=>
									   {
						                              let button = document.getElementById('delete-item-modal');
									      
									      button.setAttribute('idx', item.idx);
									      button.setAttribute('table_name', tableName);
									      button.setAttribute('table_idx', idx); 
									      deleteFile(); 
									   });
									
									   li.appendChild(fileNameP);
									   li.appendChild(fileSizeP);
									   li.appendChild(deleteButton);
	
									   li.onclick = function() {
									     // code to be executed when the li element is clicked
									      
									      const image = document.createElement('img');
									      image.width = 200;
									      image.height = 200;
									      image.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
									      document.querySelector(gal_prev).innerHTML = image.outerHTML;
									  };
									
									   document.querySelector(list).appendChild(li);
	
									   if(isFirst){
										   isFirst = false;
										   li.click();
									   }
								      }    
							      } catch(err){ }
							   });
						      }
						      
						      if(proc){
							 document.querySelector(img_prev).style.display = "none";
	                                                 document.querySelector(img_upd).style.display = "block";
							 document.querySelector(img_del).style.display = "none";
						      }
					      })
					      .catch(error => console.error('Error:', error));

						function formatFileSize(bytes) {
						  if (bytes === 0) return '0 bytes';
						
						  const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB'];
						  const index = Math.floor(Math.log(bytes) / Math.log(1024));
						
						  const size = bytes / Math.pow(1024, index);
						  return `${size.toFixed(2)} ${sizes[index]}`;
						}
					}

					window.deleteFile = function()
					{
					    // Show the modal
					    document.getElementById('delete-item-modal').action = "File"; 
					    document.getElementById('delete-item-modal').style.display = 'block';
					    document.getElementById('delete-item-modal').classList.add('show');
					    //
					}
					window.uploadImage = function(input) {
					  let file = input.files[0];
					  let fileName = file.name;
					  let fileSize = file.size;
					  let reader = new FileReader();
					  reader.onload = function(event) {
					    let base64String = event.target.result;
					    let tableIdx = input.getAttribute('idx');
					    let tableGallery = input.getAttribute('gallery') == 'YES';
					    constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize);
					  };
					  reader.readAsDataURL(file);
					}
					
					function constructSql(base64String, tableIdx, tableGallery, input , fileName, fileSize) {
					  let tableName = param.table;
					
					  let sqlQuery = base64String;
					  const packetSize = 10000;
					  const packets = [];
					
					  for (let i = 0; i < sqlQuery.length; i += packetSize) {
					    const packetId = Math.floor(i / packetSize);
					    const packetData = encodeURIComponent(sqlQuery.slice(i, i + packetSize));
					    const isLastPacket = packetId === Math.ceil(sqlQuery.length / packetSize) - 1;
					
					    packets.push({
					      clientId: '', // Client ID will be generated on the server-side
					      packetId,
					      packetData,
					      isLastPacket
					    });
					  }
					
					  packets[0]["tableName"] = tableName;
					  packets[0]["tableIdx"] = tableIdx;
					  packets[0]["session"] = encodeURIComponent(session);
					  packets[packets.length - 1]["session"] = encodeURIComponent(session);
					  packets[packets.length - 1]["tableGallery"] = tableGallery;
					  packets[packets.length - 1]["fileName"] = fileName;
					  packets[packets.length - 1]["fileSize"] = fileSize;
					
					  // Create a progress bar container
					  const progressBarContainer = document.createElement('div');
					  progressBarContainer.style.background = '#f0f0f0'; // Grayish background
					  progressBarContainer.style.padding = '5px';
					  progressBarContainer.style.borderRadius = '5px';
					  progressBarContainer.style.width = '200px'; // Adjust the width as needed
					  progressBarContainer.style.marginTop = '10px'; // Add some margin top
					
					  // Create a progress bar
					  const progressBar = document.createElement('div');
					  progressBar.style.width = '0%';
					  progressBar.style.height = '20px';
					  progressBar.style.background = 'blue';
					
					  // Create a progress text element
					  const progressText = document.createElement('span');
					  progressText.style.float = 'right';
					
					  progressBarContainer.appendChild(progressBar);
					  progressBarContainer.appendChild(progressText);
					
					  input.insertAdjacentElement('afterend', progressBarContainer);
					
					  // Send the first packet to the server to generate the client ID
					  fetch(d_config.url + 'receivePacket', {
					    method: 'POST',
					    headers: { 'Content-Type': 'application/json' },
					    body: JSON.stringify(packets[0])
					  })
					  .then((response) => response.json())
					  .then((data) => {
					    const clientId = data.clientId;
					    //console.log(clientId);
					
					    // Send the remaining packets with the generated client ID
					    function sendPackets(packets, index = 0) {
					      if (index >= packets.length) {
					        // Remove the progress bar container
					        progressBarContainer.remove();
						// Refresh 
                                                manageFiles(tableIdx);
						//
					        return;
					      }
					
					      const packet = packets[index];
					      packet.clientId = clientId;
					
					      // Update the progress bar and text
					      const progress = (index / packets.length) * 100;
					      progressBar.style.width = progress + '%';
					      progressText.innerText = `${Math.floor(progress)}%`;
					
					      fetch(d_config.url + 'receivePacket', {
					        method: 'POST',
					        headers: { 'Content-Type': 'application/json' },
					        body: JSON.stringify(packet)
					      })
					      .then((response) => response.json())
					      .then((data) => {
					        //console.log(data);
					        sendPackets(packets, index + 1); // Send the next packet
					      })
					      .catch((error) => console.error(error));
					    }
					
					    sendPackets(packets.slice(1));
					  })
					  .catch((error) => console.error(error));
					}
					// Function to update a row
					function updateRow(idx) { 
					    // Populate the form fields with the row data
					    let rowData = tableData.find((row) => row['idx'] === idx); 
					    
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

					     // Get the form data and send it to the server to add the new item
					    let doc = document.getElementById('update-item-form');
				            let formData = new FormData(doc);
			
					    console.log(doc); 
					    console.log(formData);
			
					    const fks = [];
					    doc.querySelectorAll("[tab]:not([tab='null']):not([tab=''])").forEach((fk) => {
					       if (fk.hasAttribute("col") && fk.hasAttribute("refcol") && fk.hasAttribute("tab") && fk.hasAttribute("id")) {
					        fks.push({
					          col: fk.getAttribute("col"),
					          refcol: fk.getAttribute("refcol"),
					          tab: fk.getAttribute("tab"),
					          id: fk.getAttribute("id")
					        });
					       }
					    });
			
					    console.log(fks); 
			 
				            let columns = table.columns.filter((column) => column.name !== "idx").map(column => column.name);
				            let values = [];
					    let tables = [];
					    let exists = ['idx = ${idx}'];
						
				            formData.forEach((value, key) => {
				                if (columns.includes(key))
						{
						    console.log(fks , key);
						    var fs = fks.filter(item => item.id == key);
						    console.log(fs);
			
						    if(fs.length > 0){
							values.push(`${key} = d${values.length + 1}.${fs[0].refcol}`);    
							tables.push(`${fs[0].tab} d${values.length}`);
							exists.push(`EXISTS (
					                        SELECT 1
					                        FROM ${fs[0].tab} c${values.length} 
					                        WHERE c${values.length}.${fs[0].col} = '${value}' AND d${values.length}.${fs[0].refcol} = c${values.length}.${fs[0].refcol}
					                )`);
						    }
						    else{
							values.push(`${key} = '${value}'`);    
						    } 
				                }
				            });
				            let query = null;
						
					    if(fks.length == 0)
					    {
						 query = `UPDATE ${param.table} SET `;
						 table.columns.forEach((column, index) => {
						        if (column.name !== 'idx') {
						            query += `${column.name} = '${formData.get(column.name)}'`;
						            if (index < table.columns.length - 2) {
						                query += ', ';
						            }
						        }
						 });
					         query += ` WHERE idx = ${idx}`;
					    }
					    else {
						 query = `UPDATE ${param.table} 
			                                  SET ${values.join(', ')}
			                                  FROM ${tables.join(', ')}
							  WHERE ${exists.join('AND ')}`   
					    }
			
					    console.log(query);
					 
					    //return;
						
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
					    document.getElementById('delete-item-modal').action = "Row"; 
					    document.getElementById('delete-item-modal').style.display = 'block';
					    document.getElementById('delete-item-modal').classList.add('show');
					    //
					}
					
					// Add event listener for delete item button
					document.getElementById('delete-item-btn').addEventListener('click', (e) => {
					    e.preventDefault();

					    let button = document.getElementById('delete-item-modal');
					    let action = button.action;

					    console.log(action);

					    if(action == "Row")
					    {
					        // Get the idx from the modal
					        let idx = button.idx;
					
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
						        button.style.display = 'none';
						     } else {
						        console.error(data.message);
						     }
					         })
					         .catch((error) => {
						    console.error(error);
						    // Hide the modal
						    button.style.display = 'none';
					         });
					    }
					    if(action == "File"){
						 const idx = button.getAttribute('idx');
						 const tableName = button.getAttribute('table_name');
						 const tableIdx = button.getAttribute('table_idx');
	
						 fetch(d_config.url + `delete-file?session=${encodeURIComponent(session)}&tableName=${encodeURIComponent(tableName)}` +
							              `&tableIdx=${encodeURIComponent(tableIdx)}&idx=${encodeURIComponent(idx)}`)
						    .then((response) => response.json())
						    .then((data) => {
						        console.log(data);
						        manageFiles(tableIdx);
						        // Hide the modal
						        button.style.display = 'none';
						    })
						    .catch((error) => {
						        console.error(error);
						        // Hide the modal
						        button.style.display = 'none';
						    });
					    }
					});
					
					// Add event listener for cancel button
					document.getElementById('cancel-delete-item-btn').addEventListener('click', () => {
					    let button = document.getElementById('delete-item-modal');
					    // Hide the modal
					    button.style.display = 'none';
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
		
		    tableHeader += `<th style="min-width:170px; max-width:170px;">Actions</th>`; // Add the "Actions" column
	 
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
	    

	     function generateFormSearch(columns){
		columns.forEach((column) => { 
		    if(column.form == "select")
		    { 
			var query = null;
			var col = null;
			var tab = null;
			var refcol = null;
			    
			if(column.filter){

			    console.log(window.mtable);
			    var constraint = window.mtable.constraints.filter(item => item.type == "foreignKey" &&
				                                                      item.columns.includes(column.name) );
                            if(constraint.length > 0){
				constraint = constraint[0];
			        console.log(constraint);
				    
			        query = `SELECT DISTINCT(${column.filter})
				    FROM ${constraint.referencedTable}`; 
				col = column.filter;
				tab = constraint.referencedTable;
				refcol = constraint.referencedColumns[0];
				console.log(query , col , refcol , tab);
			    }
			}
		        else
			{
			    query = `SELECT DISTINCT(${column.name})
	                                   FROM ${param.table}`;
	                    col = column.name;
			    console.log(query , col , tab);
		        }

			if(query && col){
			     // Send the form data to the server using fetch API
			    fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
			    .then((response) => { 
			       return response.json();
			    })
			    .then((data) => {
			       console.log(data); 
			       if(data.success){
			          var options = data.results.recordset.map(item => item[col]);
			          console.log(options);

				  document.querySelectorAll(`#${column.name}`).forEach((select)=>{
					 
				  select.setAttribute("col" , col);
				  select.setAttribute("tab" , tab);
				  select.setAttribute("refcol" , refcol);
				       
			          options.forEach((option , index)=>{
				     var opt = document.createElement("option");
				     opt.value = option;
				     opt.innerHTML = option;
 
				     if(index == 0){
				        var optd = document.createElement("option");
				        optd.value = "";
				        optd.innerHTML = `Select ${col.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`; 
				       select.appendChild(optd);    
				     }
				     select.appendChild(opt); 

			          });  
				  });
			       }
				 
		           }).catch((err)=>{
			       console.error(err);
		           });
			}
			    
		  }
		});
	    }
		
	    function createHtmlFilters(columns) {
	        let filtersHtml = `
	            <form>
	                <div class="form-row">
	        `;
	
	        columns.forEach((column) => {
	            let filterName = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
		    if(column.form == "none"){}
		    else if(column.form == "select"){ 
	                filtersHtml += `
	                <div class="form-group col-md-3">
	                    <label for="${column.name}">${filterName}</label>
	                    <select class="form-control" id="${column.name}" name="${column.name}" placeholder="${filterName}">
		            </select>
	                </div>
	                `;
		    }
		    else{
	               filtersHtml += `
	                <div class="form-group col-md-3">
	                    <label for="${column.name}">${filterName}</label>
	                    <input type="text" class="form-control" id="${column.name}" placeholder="${filterName}">
	                </div>
	               `;
		    }
	        });
	
	        filtersHtml += `
	                </div>
		        <div class="form-group col-md-3">
	                   <button type="button" class="btn btn-primary" id="apply-filter" onclick="window.applyFilter()">Apply Filter</button>
	                </div>
		        <div class="form-group col-md-3">
		           <button type="button" class="btn btn-secondary" id="reset-filter" onclick="window.resetFilter()">Reset Filter</button>
	                </div> 
	           </form>
	        `;
	
	        return filtersHtml;
	    }
	})
	.catch((error) => {
	    console.error(error);
	});					
					


} , 500);
