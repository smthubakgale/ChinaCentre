// Sample order history data
const orderHistoryData = [
    { id: 1, image: 'assets/img/home/a_sofa_bed.jpeg', name: 'Sofa', price: 1000.00, status: 'Ordered', delivery: '2022-01-15' },
    { id: 2, image: 'assets/img/home/dining_table_set.jpeg', name: 'Dining Table', price: 800.00, status: 'Processing', delivery: '2022-02-01' },
    { id: 3, image: 'assets/img/home/beds.jpeg', name: 'Bed', price: 1200.00, status: 'Shipped', delivery: '2022-02-15' },
    { id: 4, image: 'assets/img/home/smart_tv_stand.jpeg', name: 'Smart TV Stand', price: 1500.00, status: 'Delivered', delivery: '2022-03-15' },
    { id: 5, image: 'assets/img/home/office_desk.jpeg', name: 'Office Desk', price: 500.00, status: 'Cancelled', delivery: '' },
];

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
      ORDER BY CONVERT(DATETIME, checkout_date + ':00', 126) DESC
    `;
    
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
             `;
                
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
                               <img src="" alt="${item.product_name}" class="item nav-link" href="#products" queries="${'brand=' + item.product_no}" >
                                <div class="order-history-item-info">
                                    <h2>${item.product_name}</h2>
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
/*
const orderHistoryGrid = document.getElementById('order-history-grid');
orderHistoryData.forEach((order) => {
    const item = document.createElement('div');
    item.classList.add('order-history-item');
    item.innerHTML = `
        <img src="${order.image}" alt="${order.name}">
        <div class="order-history-item-info">
            <h2>${order.name}</h2>
            <p>Price: $${order.price}</p>
            <p>Status: ${order.status}</p>
            <p>Delivery: ${order.delivery}</p>
        </div>
    `;
    orderHistoryGrid.appendChild(item);
});
*/

// Add event listener to status filter
const statusFilter = document.getElementById('status-filter');
statusFilter.addEventListener('change', (e) => {
    const selectedStatus = e.target.value;
    const items = orderHistoryGrid.children;
    Array.from(items).forEach((item) => {
        const status = item.querySelector('.order-history-item-info p:nth-child(3)').textContent.split(': ')[1];
        if (selectedStatus === 'all' || status.toLowerCase() === selectedStatus) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Add event listener to sort by filter
const sortByFilter = document.getElementById('sort-by');
sortByFilter.addEventListener('change', (e) => {
    const selectedSortBy = e.target.value;
    const items = orderHistoryGrid.children;
    const itemsArray = Array.from(items);
    let sortedItems;
    
    switch (selectedSortBy) {
        case 'name-asc':
            sortedItems = itemsArray.sort((a, b) => {
                const nameA = a.querySelector('.order-history-item-info h2').textContent;
                const nameB = b.querySelector('.order-history-item-info h2').textContent;
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            sortedItems = itemsArray.sort((a, b) => {
                const nameA = a.querySelector('.order-history-item-info h2').textContent;
                const nameB = b.querySelector('.order-history-item-info h2').textContent;
                return nameB.localeCompare(nameA);
            });
            break;
        case 'price-asc':
            sortedItems = itemsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.order-history-item-info p:nth-child(2)').textContent.split(': $')[1]);
                const priceB = parseFloat(b.querySelector('.order-history-item-info p:nth-child(2)').textContent.split(': $')[1]);
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            sortedItems = itemsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.order-history-item-info p:nth-child(2)').textContent.split(': $')[1]);
                const priceB = parseFloat(b.querySelector('.order-history-item-info p:nth-child(2)').textContent.split(': $')[1]);
                return priceB - priceA;
            });
            break;
        case 'date-asc':
            sortedItems = itemsArray.sort((a, b) => {
                const dateA = new Date(a.querySelector('.order-history-item-info p:nth-child(4)').textContent.split(': ')[1]);
                const dateB = new Date(b.querySelector('.order-history-item-info p:nth-child(4)').textContent.split(': ')[1]);
                return dateA - dateB;
            });
            break;
        case 'date-desc':
            sortedItems = itemsArray.sort((a, b) => {
                const dateA = new Date(a.querySelector('.order-history-item-info p:nth-child(4)').textContent.split(': ')[1]);
                const dateB = new Date(b.querySelector('.order-history-item-info p:nth-child(4)').textContent.split(': ')[1]);
                return dateB - dateA;
            });
            break;
        default:
            sortedItems = itemsArray;
    }
    
    orderHistoryGrid.innerHTML = '';
    sortedItems.forEach((item) => {
        orderHistoryGrid.appendChild(item);
    });
    
    // Trigger the sort by filter event if track-order query parameter is true
    if (query['track-order'] === 'true') {
        const sortByFilterEvent = new Event('change');
        sortByFilter.dispatchEvent(sortByFilterEvent);
    }
});
