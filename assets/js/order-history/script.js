window.limit = 30;
window.offset = 0;
window.currentPage = 1;
window.totalPages = 1;
let whereClause = ''; 
let selectedSortBy2 = '';

// Get query parameters
const query = window.queryParam || window.queryParam(window.location);
console.log(window.queryParam , window.location , query) ; 

// Check for track-order query parameter
if (query['track-order'] === 'true') {
    const sortByFilter = document.getElementById('sort-by');
    sortByFilter.value = 'date-desc';
}

// Populate order history grid
loadOrderHistory();
// Add event listeners to pagination buttons
document.querySelector('.previous-button').addEventListener('click', () => {
	if (offset >= limit) {
		offset -= limit;
		currentPage -= 1;
		updatePaginationNumbers();
		loadProducts();
	}
});

document.querySelector('.next-button').addEventListener('click', () => {
	if (offset + limit < totalCount) {
		offset += limit;
		currentPage += 1;
		updatePaginationNumbers();
		loadProducts();
	}
});
window.updatePaginationNumbers = function() {
    let paginationNumbersHtml = '';
    console.log(totalPages);
    if (totalPages <= 4) {
	for (let i = 0; i < totalPages; i++) {
	    if (i + 1 === currentPage) {
		paginationNumbersHtml += `<button class="pagination-number active">${i + 1}</button>`;
	    } else {
		paginationNumbersHtml += `<button class="pagination-number">${i + 1}</button>`;
	    }
	}
    } else {
	if (currentPage === 1) {
	    paginationNumbersHtml += `<button class="pagination-number active">1</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">2</button>`;
	    paginationNumbersHtml += `_`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages - 1}</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages}</button>`;
	} else if (currentPage === totalPages) {
	    paginationNumbersHtml += `<button class="pagination-number">1</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">2</button>`;
	    paginationNumbersHtml += `_`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages - 1}</button>`;
	    paginationNumbersHtml += `<button class="pagination-number active">${totalPages}</button>`;
	} else if (currentPage === 2) {
	    paginationNumbersHtml += `<button class="pagination-number">1</button>`;
	    paginationNumbersHtml += `<button class="pagination-number active">2</button>`;
	    paginationNumbersHtml += `__`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages - 1}</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages}</button>`;
	} else if (currentPage === totalPages - 1) {
	    paginationNumbersHtml += `<button class="pagination-number">1</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">2</button>`;
	    paginationNumbersHtml += `__`;
	    paginationNumbersHtml += `<button class="pagination-number active">${totalPages - 1}</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages}</button>`;
	} else {
	    paginationNumbersHtml += `<button class="pagination-number">1</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">2</button>`;
	    paginationNumbersHtml += `__`;
	    paginationNumbersHtml += `<button class="pagination-number active">${currentPage}</button>`;
	    paginationNumbersHtml += `__`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages - 1}</button>`;
	    paginationNumbersHtml += `<button class="pagination-number">${totalPages}</button>`;
	}
    }
    document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
    document.getElementById('pagination-numbers').style.opacity = 1;

	// Add event listeners to pagination numbers 
	document.querySelectorAll('#pagination-numbers button').forEach((button) => {
	     button.addEventListener('click', (e) => {
		e.preventDefault();
		let newPage = parseInt(button.textContent);
		if (newPage === currentPage) return;
		offset = (newPage - 1) * limit;
		currentPage = newPage;
		updatePaginationNumbers();
		loadOrderHistory();
	     });
	});
}

function loadOrderHistory(){
let query = `
      SELECT *
      FROM User_Payments
      ${whereClause}
      ${selectedSortBy2 == '' ? `ORDER BY CONVERT(DATETIME, checkout_date + ':00', 126) DESC` : selectedSortBy2}
    `;

    console.log(query); 
    
    fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
    .then((response) => { 
        return response.json();
    })
    .then((data) => {
        console.log(data); 
        if(data.success && data.results)
        {
            document.querySelector(".order-history-grid").innerHTML = '';
            
            data.results.recordset.forEach((res)=>
            { 
                  let query2 = `
                      SELECT COUNT(*)
		      FROM Product_Cart pc
		      LEFT JOIN Products p ON pc.product_no = p.idx
		      LEFT JOIN Categories c ON p.category_no = c.idx
		      WHERE pc.checkout_key = '${res.checkout_key}';
                   `;

                console.log(query2);

                  fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query2)}`)
                  .then((response) => response.json())
                  .then((data) => { 
                       console.log(data);
                      if(data.success && data.results)
                      { 
			    let totalCount = data.results.recordset[0][''];
		            totalCount = parseInt(totalCount) == 0 ? 1 : totalCount;
			    
			    // Set default limit and offset
			    window.limit = 10;
			    window.offset = 0;
			    window.currentPage = 1;
			    window.totalPages = Math.ceil(totalCount / limit);
                            updatePaginationNumbers();
                            nex();
                      }
                  })
                  .catch((error) => {
                      console.error(error);
                  }); 
                        
                //nex();
                function nex(){
                    let query3 = `
                      SELECT pc.*, p.product_name, p.price , p.product_name , COALESCE(c.category_name, '') AS category_name
                      FROM Product_Cart pc
                      JOIN Products p ON pc.product_no = p.idx
                      LEFT JOIN Categories c ON p.category_no = c.idx
                      WHERE pc.checkout_key = '${res.checkout_key}';
                      ${selectedSortBy}
                   `;
                    
                   console.log(query2); 
                    
                   fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query3)}`)
                  .then((response) => { 
                      return response.json();
                  })
                  .then((data) => {
                      console.log(data); 
                      if(data.success && data.results)
                      {
                           data.results.recordset.forEach((item)=>
                           {
                               let product = new DOMParser().parseFromString(`
                                   <div class="order-history-item">
                                   <img src="" alt="${item.product_name}" class="item nav-link" href="#products" queries="${'product=' + item.product_no}" >
                                    <div class="order-history-item-info">
                                        <h2>${item.product_name}</h2>
                                        <p>Quantity: ${item.quantity} </p>
                                        <p>Price: R ${addSpaces(item.price+"")}</p>
                                        <p> Date : ${res.checkout_date.replace('T' , ' ')}</p> 
                                        <p>Status: ${res.checkout_status}</p> 
                                    </div>
                                   </div>
                                   `, 
                                   "text/html").body.firstChild;
        
                                     const img = product.querySelector("img");
                       
                                      fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Products&tableIdx=${item.product_no}`)
                                     .then(response => response.json())
                                     .then((data) => 
                                      {   
                                        var proc = true; 
                                        if(data.recordset)
                                        {
                                          console.log(data.recordset);
                                          data.recordset.forEach((item)=>
                                          {  
                                                 if(item.file_name && item.file_size && item.gallery == "NO" && proc)
                                                 {
                                                    proc = false ;
                                                    
                                                    img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Brands&idx=${encodeURI(item.idx)}`;
                                                 }				   
                                            });
                                        }
                                          
                                        if(proc){
                                          const icon = document.createElement("i");
                                            icon.className = "fas fa-image";
                                            icon.title = "No image available";
                                            img.insertAdjacentElement("afterend", icon);
                                            img.style.display = "none";
                                   
                                        }
                                     })
                                     .catch(error => console.error('Error:', error));
                               
                                     document.querySelector(".order-history-grid").appendChild(product);
                           });
                      }
                  })
                  .catch((error) => {
                      console.error(error);
                  }); 

              }
                
            });
        }
    }) 
    .catch((error) => {
      console.error(error);
    });    
}

// Add event listener to status filter
function createFilter(){
    whereClause= 'WHERE '; 

    if(selectedStatus != '' && selectedStatus != 'all'){
        whereClause+= ` checkout_status = '${selectedStatus}' `; 
    }
    

    if(whereClause.trim() == "WHERE"){ whereClause= ''; } 

    loadOrderHistory();
}
let selectedStatus = '';
const statusFilter = document.getElementById('status-filter');
statusFilter.addEventListener('change', (e) => {
    selectedStatus = e.target.value;
    createFilter();
});

// Add event listener to sort by filter
let selectedSortBy = '';
const sortByFilter = document.getElementById('sort-by');
sortByFilter.addEventListener('change', (e) => {
    let value  = e.target.value;
    switch (value) { 
        case 'name-asc':
            selectedSortBy = `ORDER BY p.product_name ASC`; 
            break;
        case 'name-desc':
            selectedSortBy = `ORDER BY p.product_name DESC`; 
            break;
        case 'price-asc':
            selectedSortBy = `ORDER BY p.price ASC`; 
            break;
        case 'price-desc':
            selectedSortBy = `ORDER BY p.price DESC`; 
            break;
        case 'date-asc':
            selectedSortBy2 = `ORDER BY CONVERT(DATETIME, checkout_date + ':00', 126) ASC`; 
            break;
        case 'date-desc':
            selectedSortBy2 = `ORDER BY CONVERT(DATETIME, checkout_date + ':00', 126) DESC`; 
            break;
        default:
            selectedSortBy = "";
            selectedSortBy2 = "";
    }
    createFilter(); 
});
