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
    const sortByFilter = document.getElementById('sort-order');
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
	if (offset + limit < totalPages) {
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
            document.querySelector("#payment-history-body").innerHTML = '';
            
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
                      WHERE pc.checkout_key = '${res.checkout_key}'
                      ${selectedSortBy}
		      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
                   `;
                    
                   console.log(query3); 
                    
                   fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query3)}`)
                  .then((response) => { 
                      return response.json();
                  })
                  .then((data) => {
                      console.log(data); 
                      if(data.success && data.results)
                      {
                          let total = 0.0;
                           data.results.recordset.forEach((item)=>
                           {
                              total += parseFloat(item.quantity)*parseFloat(item.price);
                           });

                           let payment = new DOMParser().parseFromString(`
                                   <tr>
                                        <td> ${res.checkout_date.replace('T' , ' ')} </td>
                                        <td>R ${total}</td>
                                        <td> ${res.checkout_status} </td>
                                        <td><button class="request-invoice-button" data-payment-id="${res.idx}">Request Invoice</button></td>
                                   </tr>
                                   `, 
                                   "text/html").body.firstChild;
        
                            document.querySelector("#payment-history-body").appendChild(payment);
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
    let and = false;

    if(selectedStatus != '' && selectedStatus != 'all'){
        whereClause+= ` checkout_status = '${selectedStatus}' `; 
        and = true;
    }

    if(dateFilter != ''){
        if(and){
            whereClause += ' AND ';
        }
        if (dateFilter === 'Today' ) {
            whereClause += `CONVERT(DATE, CONVERT(DATETIME, checkout_date + ':00', 126)) = CONVERT(DATE, GETDATE())`;
        }
        if (dateFilter === 'This Week' ) {
             whereClause += `CONVERT(DATETIME, checkout_date + ':00', 126) >= DATEADD(day, 1 - DATEPART(dw, GETDATE()), CONVERT(DATE, GETDATE()))
                             AND CONVERT(DATETIME, checkout_date + ':00', 126) < DATEADD(day, 8 - DATEPART(dw, GETDATE()), CONVERT(DATE, GETDATE()))`;
        }
        if (dateFilter === 'This Month' ) {
             whereClause += `CONVERT(DATETIME, checkout_date + ':00', 126) >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                             AND CONVERT(DATETIME, checkout_date + ':00', 126) < DATEADD(month, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))`;
        }
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
const sortByFilter = document.getElementById('sort-order');
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

let dateFilter = '';
const dateFilterElement = document.getElementById('date-filter');
dateFilterElement.addEventListener('change', (e) => {
    dateFilter = e.target.value;
    createFilter();
});

// Add event listener for request invoice buttons
document.querySelectorAll('.request-invoice-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const paymentId = e.target.getAttribute('data-payment-id');
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', 'invoice');
        urlParams.set('fill', 'top');
        urlParams.set('payment-id', paymentId);
        window.location.search = urlParams.toString();
    });
});
//

