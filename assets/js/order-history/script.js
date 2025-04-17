let whereSql = ''; 
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
function loadOrderHistory(){
let query = `
      SELECT *
      FROM User_Payments
      ${whereSql}
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
                  SELECT pc.*, p.product_name, p.price , p.product_name , COALESCE(c.category_name, '') AS category_name
                  FROM Product_Cart pc
                  JOIN Products p ON pc.product_no = p.idx
                  LEFT JOIN Categories c ON p.category_no = c.idx
                  WHERE pc.checkout_key = '${res.checkout_key}';
                  ${selectedSortBy}
               `;
                
               console.log(query2); 
                
               fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query2)}`)
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
                
            });
        }
    }) 
    .catch((error) => {
      console.error(error);
    });    
}

// Add event listener to status filter
function createFilter(){
    whereSql = 'WHERE '; 

    if(selectedStatus != '' && selectedStatus != 'all'){
        whereSql += ` checkout_status = '${selectedStatus}' `; 
    }
    

    if(whereSql.trim() == "WHERE"){ whereSql = ''; } 

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
