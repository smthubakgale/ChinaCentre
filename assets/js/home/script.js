let query = '';
// 1. Read Deoartments 

query =  `SELECT TOP 6 *
FROM Departments
ORDER BY NEWID();`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item)=>
         {
              console.log(item);
              
             let department = new DOMParser().parseFromString(
              `<div class="department nav-link" href="#products" >
                 <img src="" alt="">
                 <h5></h5>
               </div>`, 
              "text/html").body.firstChild;
              
             const h5 = department.querySelector("h5");
             const img = department.querySelector("img");
              
             h5.innerHTML = item.department_name;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Departments&tableIdx=${item.idx}`)
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
                            
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Departments&idx=${encodeURI(item.idx)}`;
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
              
             img.alt = item.department_name;

             document.querySelector('.shop-by-department .final').appendChild(department);
         });
    }
})
.catch((error) => {
    console.error(error);
});

// 2. Read Brands 

query =  `SELECT TOP 6 *
FROM Brands
ORDER BY NEWID();`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item)=>
         {
              console.log(item);
              
             let brand = new DOMParser().parseFromString(
              `<div class="item nav-link" href="#products" >
                 <img src="" alt="">
                 <h5></h5>
               </div>`, 
             "text/html").body.firstChild;
              
             const h5 = brand.querySelector("h5");
             const img = brand.querySelector("img");
              
             h5.innerHTML = item.brand_name;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Brands&tableIdx=${item.idx}`)
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
              
             img.alt = item.brand_name;

             document.querySelector('.explore-brands .final').appendChild(brand);
         });
    }
})
.catch((error) => {
    console.error(error);
}); 
      
// 3. Read Products

query = `SELECT TOP 6 
  p.idx, 
  p.product_name, 
  p.price, 
  d.department_name, 
  c.category_name
FROM Products p
INNER JOIN Categories c ON p.category_no = c.idx
INNER JOIN Departments d ON c.department_no = d.idx
WHERE c.department_no = (SELECT TOP 1 department_no FROM Categories ORDER BY NEWID())
ORDER BY NEWID()`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item , index)=>
         {
             console.log(item);
              if(index == 0){
                 document.querySelector('.top-selling-items .categ').innerHTML = item.category_name; 
              }
              
             let product = new DOMParser().parseFromString(
              `<div class="item">
            <img class="nav-link" href="#product" src="" alt="">
            <h5></h5>
            <p></p>
            <button class="nav-link" href="#cart" fill="top" >
              <i class="fas fa-shopping-cart" ></i> Add to Cart
            </button>
          </div>`, 
             "text/html").body.firstChild;
              
             const h5 = product.querySelector("h5");
             const p = product.querySelector("p");
             const img = product.querySelector("img");
              
             h5.innerHTML = item.product_name;
             p.innerHTML = `R ${item.price}`;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Products&tableIdx=${item.idx}`)
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
                            
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Products&idx=${encodeURI(item.idx)}`;
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
              
             img.alt = item.product_name;

             document.querySelector('.top-selling-items .final').appendChild(product);
         });
    }
})
.catch((error) => {
    console.error(error);
}); 
