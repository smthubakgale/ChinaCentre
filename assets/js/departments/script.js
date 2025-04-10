let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');

//console.log(urs);

let Params = getQueryParams(urs);
let did = Params['department'];

console.log(Params , did);

if(did)
{
// Read Categorys
let query =  `
SELECT TOP 16 
  c.*,
  d.department_name
FROM 
  Categories c
  INNER JOIN Departments d ON c.department_no = d.idx
WHERE 
  c.department_no = ${did}
ORDER BY 
  NEWID();
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item , index)=>
         {
              //console.log(item);
             if(index == 0){
               document.querySelectorAll(".dept").forEach((dep)=>{
                  dep.innerHTML = item.department_name;
                  dep.style.opacity = 1;
               }); 
               //
             }

             let cat = new DOMParser().parseFromString( `
                 <div class="category-container">
                    <div class="category-header">
                      <h4>${item.category_name}</h4>
                      <div class="view-all-container">
                        <a href="#products" class="nav-link view-all" queries="${'category=' + item.idx}" >View All</a>
                      </div>
                    </div>
                    <div class="category-grid" style="display: flex; flex-wrap: wrap; justify-content: center;">
    
                    </div>
                  </div>
             `,  "text/html").body.firstChild;


            let query2 = `
               SELECT TOP 8 
                  p.idx, 
                  p.product_name, 
                  p.price AS original_price,
                  (p.price * COALESCE(ds.discount_amount, 0) / 100) AS discount_value,
                  (p.price - (p.price * COALESCE(ds.discount_amount, 0) / 100)) AS discount_price,
                  d.department_name, 
                  c.category_name,
                  di.discount_no,
                  COALESCE(ds.discount_amount, 0) AS discount_amount,
                  ds.end_date,
                  COALESCE(ds.discount_name, '') AS discount_name,
                  COALESCE(b.brand_name, '') AS brand_name
                FROM 
                  Products p
                  INNER JOIN Categories c ON p.category_no = c.idx
                  INNER JOIN Departments d ON c.department_no = d.idx
                  LEFT JOIN Brands b ON p.brand_no = b.idx
                  LEFT JOIN Discount_Items di ON p.idx = di.product_no
                  LEFT JOIN Discounts ds ON di.discount_no = ds.idx AND ds._status = 'Public'
                WHERE 
                  c.idx = ${item.idx}
                ORDER BY 
                  COALESCE(ds.discount_amount, 0) DESC, 
                  NEWID();
            `;

            fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query2)}`)
            .then((response) => response.json())
            .then((data) => { 
                 console.log(data);
                if(data.success && data.results)
                {
                     data.results.recordset.forEach((item)=>
                     {
                        console.log(item);
                       
                        let product =  new DOMParser().parseFromString( `
                            <div class="item">
                              <img class="nav-link" href="#product" queries="${'product=' + item.idx}" src="" alt="">
                              <h5>${item.product_name}</h5>
                              <p>
                              ${item.discount_value > 0 ? 
                                `<span class="old-price">R ${ item.original_price } </span> <span>R ${ item.discount_price }</span>` :
                                `R ${item.original_price}`} 
                              </p>
                              <button class="carts" >
                                  <i class="fas fa-shopping-cart"></i>
                              </button>
                            </div>
                         `,  "text/html").body.firstChild;

                         const carts = product.querySelector(".carts");
            
                         carts.onclick = ()=>{
                            cart_add(item.idx , 1);
                         };
                        const img = product.querySelector("img");
               
                        fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Products&tableIdx=${item.idx}`)
                       .then(response => response.json())
                       .then((data) => 
                        {   
                          var proc = true; 
                          if(data.recordset)
                          {
                            //console.log(data.recordset);
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

                        cat.querySelector('.category-grid').appendChild(product);
                       
                     });
                }
            })
            .catch((error) => {
                console.error(error);
            });
 
            document.querySelector(".item-list.final").appendChild(cat);
              
             let category = new DOMParser().parseFromString( `
                  <div href="#products" class="category nav-link"  queries="${'category=' + item.idx}"  >
                     <img src="" alt="">
                     <div>${item.category_name}</div>
                  </div>
              `, 
              "text/html").body.firstChild; 
            
              const img = category.querySelector("img");
                
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Categories&tableIdx=${item.idx}`)
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
                            
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Categories&idx=${encodeURI(item.idx)}`;
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
              
             img.alt = item.category_name;

             document.querySelector('.categories-grid.final').appendChild(category);
         });
    }
})
.catch((error) => {
    console.error(error);
});
   
}
