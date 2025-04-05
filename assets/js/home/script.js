let query = '';
// 1. Read Departments 

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
              `<div class="department nav-link" href="#departments" queries="${'department=' + item.idx}" >
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
              `<div class="item nav-link" href="#products" queries="${'brand=' + item.idx}" >
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
                 document.querySelector('.top-selling-items .categ').innerHTML = singularToPlural(item.department_name); 
              }
              
             let product = new DOMParser().parseFromString(
              `<div class="item">
            <img class="nav-link" href="#product"  queries="${'product=' + item.idx}" src="" alt="">
            <h5></h5>
            <p></p>
            <div style="display:flex; gap: 5px 10px; justify-content: center; "> 
                 <button class="carts" >
                   <i class="fas fa-shopping-cart" ></i>  
                 </button>
                 <button>
                    <i class="fas fa-heart"></i> 
                 </button> 
            </div>
          </div>`, 
             "text/html").body.firstChild;
              
             const h5 = product.querySelector("h5");
             const p = product.querySelector("p");
             const img = product.querySelector("img");
             const carts = product.querySelector(".carts");

             carts.onclick = ()=>{
                cart_add(item.idx , 1);
             };
              
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

// 4. Read Best Deals 

query = `
SELECT TOP 6 
  p.idx, 
  p.product_name, 
  p.price AS original_price,
  (p.price * ds.discount_amount / 100) AS discount_value,
  (p.price - (p.price * ds.discount_amount / 100)) AS new_price,
  d.department_name, 
  c.category_name,
  di.discount_no,
  ds.discount_amount,
  ds.end_date
FROM Products p
INNER JOIN Categories c ON p.category_no = c.idx
INNER JOIN Departments d ON c.department_no = d.idx
LEFT JOIN Discount_Items di ON p.idx = di.product_no
LEFT JOIN Discounts ds ON di.discount_no = ds.idx
WHERE c.department_no = (SELECT TOP 1 department_no FROM Categories ORDER BY NEWID())
AND ds._status = 'Public'
ORDER BY ds.discount_amount ASC, NEWID()
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         if(data.results.recordset.length == 0){
             document.querySelector('.deals-of-the-day').remove(); 
         }
         
         data.results.recordset.forEach((item , index)=>
         {
             console.log(item); 
             if(new Date() < new Date(item.end_date)){
                 let product = new DOMParser().parseFromString(
                   `<div class="item">
                 <img class="nav-link" href="#product" queries="${'product=' + item.idx}" src="" alt="">
                 <h5></h5>
                 <p></p>
                 <div style="display:flex; gap: 5px 10px; justify-content: center; "> 
                      <button class="carts" >
                        <i class="fas fa-shopping-cart" ></i>  
                      </button>
                      <button>
                         <i class="fas fa-heart"></i> 
                      </button> 
                 </div>
               </div>`, 
                  "text/html").body.firstChild;
                   
                  const h5 = product.querySelector("h5");
                  const p = product.querySelector("p");
                  const img = product.querySelector("img");
                  const carts = product.querySelector(".carts");
     
                  carts.onclick = ()=>{
                     cart_add(item.idx , 1);
                  };
     
                  console.log(new Date(item.end_date) , new Date() < new Date(item.end_date));
                   
                  h5.innerHTML = item.product_name;
                  p.innerHTML = `Was: R ${item.original_price} | Now: R ${item.new_price}`;
                   
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
     
                  document.querySelector('.deals-of-the-day .final').appendChild(product);  
             }  
         });
    }
})
.catch((error) => {
    console.error(error);
}); 

// 5. Favourites Products 
query = `
SELECT TOP 6 
  p.idx, 
  p.product_name, 
  p.price
FROM Products p
WHERE p.idx IN (
  SELECT TOP 6 product_no
  FROM Product_Cart
  GROUP BY product_no
  ORDER BY NEWID()
)
ORDER BY NEWID()
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         if(data.results.recordset.length == 0){
             document.querySelector('.your-favourites').remove(); 
         }
         
         data.results.recordset.forEach((item , index)=>
         {
             console.log(item); 
             if(true){
                 let product = new DOMParser().parseFromString(
                   `<div class="item">
                      <img src="" class="nav-link" href="#product"  queries="${'product=' + item.idx}" src="" alt="">
                      <h5></h5>
                      <p>R 1,299.99</p>
                      <div style="display:flex; gap: 5px 10px; justify-content: center; "> 
                           <button class="carts" >
                             <i class="fas fa-shopping-cart" ></i>  
                           </button>
                           <button>
                              <i class="fas fa-heart"></i> 
                           </button> 
                      </div>
                    </div>`, 
                  "text/html").body.firstChild;
                   
                  const h5 = product.querySelector("h5");
                  const p = product.querySelector("p");
                  const img = product.querySelector("img");
                  const carts = product.querySelector(".carts");
     
                  carts.onclick = ()=>{
                     cart_add(item.idx , 1);
                  };
     
                  console.log(new Date(item.end_date) , new Date() < new Date(item.end_date));
                   
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
     
                  document.querySelector('.your-favourites .final').appendChild(product);  
             }  
         });
    }
})
.catch((error) => {
    console.error(error);
});

// 6. Recommendations

query = `
SELECT TOP 20 
  p.idx, 
  p.product_name, 
  p.price
FROM Products p
WHERE p.idx IN (
  SELECT TOP 20 product_no
  FROM Product_Cart
  GROUP BY product_no
  ORDER BY COUNT(*) DESC
)
OR p.category_no IN (
  SELECT c.idx
  FROM Categories c
  INNER JOIN Products p2 ON c.idx = p2.category_no
)
ORDER BY NEWID()
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         if(data.results.recordset.length == 0){
             document.querySelector('.recommended-for-you').remove(); 
         }
         
         data.results.recordset.forEach((item , index)=>
         {
             console.log(item); 
             if(true){
                 let product = new DOMParser().parseFromString(
                   `<div class="item">
                      <img src="" class="nav-link" href="#product"  queries="${'product=' + item.idx}" src="" alt="">
                      <h5> </h5>
                      <p> </p> 
                      <div style="display:flex; gap: 5px 10px; justify-content: center; "> 
                           <button class="carts" >
                             <i class="fas fa-shopping-cart" ></i>  
                           </button>
                           <button>
                              <i class="fas fa-heart"></i> 
                           </button> 
                      </div>
                    </div> `,  
                  "text/html").body.firstChild;
                   
                  const h5 = product.querySelector("h5");
                  const p = product.querySelector("p");
                  const img = product.querySelector("img");
                  const carts = product.querySelector(".carts");
     
                  carts.onclick = ()=>{
                     cart_add(item.idx , 1);
                  };
     
                  console.log(new Date(item.end_date) , new Date() < new Date(item.end_date));
                   
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
     
                  document.querySelector('.recommended-for-you .final').appendChild(product);  
             }  
         });
    }
})
.catch((error) => {
    console.error(error);
});

// 7. Read Products Specials 

query = `
WITH RandomDiscount AS (
  SELECT TOP 1 ds2.discount_name, ds2.discount_amount
  FROM Discounts ds2
  INNER JOIN Discount_Items di2 ON ds2.idx = di2.discount_no
  INNER JOIN Products p2 ON di2.product_no = p2.idx
  WHERE p2.category_no = (SELECT TOP 1 category_no FROM Categories ORDER BY NEWID())
  AND ds2._status = 'Public'
  ORDER BY NEWID()
)
SELECT TOP 6 
  p.idx, 
  p.product_name, 
  p.price AS original_price,
  (p.price * ds.discount_amount / 100) AS discount_value,
  (p.price - (p.price * ds.discount_amount / 100)) AS new_price,
  d.department_name, 
  c.category_name,
  di.discount_no,
  ds.discount_amount,
  ds.end_date,
  ds.discount_name
FROM Products p
INNER JOIN Categories c ON p.category_no = c.idx
INNER JOIN Departments d ON c.department_no = d.idx
LEFT JOIN Discount_Items di ON p.idx = di.product_no
LEFT JOIN Discounts ds ON di.discount_no = ds.idx
INNER JOIN RandomDiscount rd ON ds.discount_name = rd.discount_name AND ds.discount_amount = rd.discount_amount
WHERE c.department_no = (SELECT TOP 1 department_no FROM Categories ORDER BY NEWID())
AND ds._status = 'Public'
ORDER BY ds.discount_amount ASC, NEWID();
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         if(data.results.recordset.length == 0){
             document.querySelector('.your-discounts').remove(); 
         }
         
         data.results.recordset.forEach((item , index)=>
         {
             console.log(item);
              if(index == 0){
                 document.querySelector('.your-discounts .header span').innerHTML = singularToPlural(item.discount_name); 
              }
              
             let product = new DOMParser().parseFromString(
              ` <div class="item">
            <img class="nav-link" href="#product" queries="${'product=' + item.idx}" src="" alt="Bedding Set">
            <h5></h5>
            <p></p>
            <div style="display:flex; gap: 5px 10px; justify-content: center; "> 
                 <button class="carts" >
                   <i class="fas fa-shopping-cart" ></i>  
                 </button>
                 <button>
                    <i class="fas fa-heart"></i> 
                 </button> 
            </div>
          </div>`, 
             "text/html").body.firstChild;
              
             const h5 = product.querySelector("h5");
             const p = product.querySelector("p");
             const img = product.querySelector("img");
             const carts = product.querySelector(".carts");

             carts.onclick = ()=>{
                cart_add(item.idx , 1);
             };
              
             h5.innerHTML = item.product_name;
             p.innerHTML = `Was: R ${item.original_price} | Now: R ${item.new_price}`;
              
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

             document.querySelector('.your-discounts .final').appendChild(product);
         });
    }
})
.catch((error) => {
    console.error(error);
}); 












function singularToPlural(word) {
  if (!word) return '';

  const rules = [
    // General rules
    { match: /s?$/, replace: 's' }, // add 's' to most words
    { match: /y$/, replace: 'ies' }, // words ending in 'y' become 'ies'
    { match: /is$/, replace: 'es' }, // words ending in 'is' become 'es'
    { match: /[csxz]h?$/i, replace: 'es' }, // words ending in 'ch', 'sh', 'o', 's', 'x', 'z' add 'es'
    { match: /f$/, replace: 'ves' }, // words ending in 'f' become 'ves'
    { match: /fe$/, replace: 'ves' }, // words ending in 'fe' become 'ves'
    { match: /us$/, replace: 'i' }, // words ending in 'us' become 'i'
    { match: /on$/, replace: 'a' }, // words ending in 'on' become 'a'
    { match: /um$/, replace: 'a' }, // words ending in 'um' become 'a'
    { match: /is$/, replace: 'es' }, // words ending in 'is' become 'es'
    { match: /ix$/, replace: 'ices' }, // words ending in 'ix' become 'ices'
    { match: /ex$/, replace: 'ices' }, // words ending in 'ex' become 'ices'
    { match: /ech$/, replace: 'eches' }, // words ending in 'ech' become 'eches'
    { match: /ch$/, replace: 'ches' }, // words ending in 'ch' become 'ches'
    { match: /sh$/, replace: 'shes' }, // words ending in 'sh' become 'shes'
    { match: /o$/, replace: 'os' }, // words ending in 'o' become 'os'
    { match: /z$/, replace: 'zes' }, // words ending in 'z' become 'zes'
    { match: /x$/, replace: 'xes' }, // words ending in 'x' become 'xes'

    // Irregular words
    { match: /^child$/, replace: 'children' },
    { match: /^foot$/, replace: 'feet' },
    { match: /^tooth$/, replace: 'teeth' },
    { match: /^man$/, replace: 'men' },
    { match: /^woman$/, replace: 'women' },
    { match: /^person$/, replace: 'people' },
  ];

  for (const rule of rules) {
    if (word.match(rule.match)) {
      return word.replace(rule.match, rule.replace);
    }
  }

  // Default rule: add 's'
  return word + 's';
}


