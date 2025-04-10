// Read Departments
let query =  `SELECT TOP 6 *
FROM Departments
ORDER BY NEWID();`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     //console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item)=>
         {
              //console.log(item);
              
             let department = new DOMParser().parseFromString(
              `<div class="department nav-link" href="#departments" queries="${'department=' + item.idx}" >
                 <img src="" alt="">
                 <div></div>
               </div> `, 
              "text/html").body.firstChild;
              
             const dv = department.querySelector("div");
             const img = department.querySelector("img");
              
             dv.innerHTML = item.department_name;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Departments&tableIdx=${item.idx}`)
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

             document.querySelector('.departments-grid.final').appendChild(department);
         });
    }
})
.catch((error) => {
    console.error(error);
});

// 2. Discounts 

query = `
     WITH RankedProducts AS (
       SELECT 
         ds.idx AS d_idx , 
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
         ds.discount_name,
         ROW_NUMBER() OVER (PARTITION BY ds.discount_name, ds.discount_amount ORDER BY NEWID()) AS row_num
       FROM Products p
       INNER JOIN Categories c ON p.category_no = c.idx
       INNER JOIN Departments d ON c.department_no = d.idx
       LEFT JOIN Discount_Items di ON p.idx = di.product_no
       LEFT JOIN Discounts ds ON di.discount_no = ds.idx
       WHERE ds._status = 'Public'
     )
     SELECT
       d_idx , 
       idx, 
       product_name, 
       original_price,
       discount_value,
       new_price,
       department_name, 
       category_name,
       discount_no,
       discount_amount,
       end_date,
       discount_name
     FROM RankedProducts
     WHERE row_num = 1
     ORDER BY discount_amount ASC;
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
    //console.log(data);
    if(data.success && data.results)
    {
        data.results.recordset.forEach((item)=>
        {
             //console.log(item);
             
             let discount = new DOMParser().parseFromString( `
            <div class="discount nav-link" href="#products" queries="${'discount=' + item.d_idx}" >
                <img src="" alt="">
                <div class="rec">
                    <div>
                        <p class="p1"> <span>${item.category_name}</span> ${item.department_name} furniture <br/> Up to </p>
                        <p class="p2">
                          ${item.discount_amount} <sup>%</sup> <sub>off</sub>
                        </p>
                    </div>
                </div>
            </div>`, 
              "text/html").body.firstChild;
 
             const img = discount.querySelector("img");
               
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

             document.querySelector('.discounts-grid.final').appendChild(discount);
        }); 
    }
})
.catch((error) => {
    console.error(error);
});

// 3. Popular Picks 

query = `
     SELECT TOP 25 
       p.idx, 
       p.product_name, 
       p.price AS original_price,
       (p.price * COALESCE(ds.discount_amount, 0) / 100) AS discount_value,
       (p.price - (p.price * COALESCE(ds.discount_amount, 0) / 100)) AS new_price,
       d.department_name, 
       c.category_name,
       di.discount_no,
       COALESCE(ds.discount_amount, 0) AS discount_amount,
       ds.end_date,
       COALESCE(ds.discount_name, '') AS discount_name,
       COALESCE(b.brand_name, '') AS brand_name,
       COALESCE(pr.avg_rating, 0) AS average_rating,
       (SELECT COUNT(*) FROM Product_Reviews WHERE product_no = p.idx) AS review_count
     FROM Products p
     INNER JOIN Categories c ON p.category_no = c.idx
     INNER JOIN Departments d ON c.department_no = d.idx
     LEFT JOIN Brands b ON p.brand_no = b.idx
     LEFT JOIN Discount_Items di ON p.idx = di.product_no
     LEFT JOIN Discounts ds ON di.discount_no = ds.idx AND ds._status = 'Public'
     LEFT JOIN (
       SELECT 
         product_no, 
         AVG(rating) AS avg_rating
       FROM 
         Product_Ratings
       GROUP BY 
         product_no
     ) pr ON p.idx = pr.product_no
     WHERE c.idx IN (SELECT TOP 3 idx FROM Categories ORDER BY NEWID())
     ORDER BY COALESCE(pr.avg_rating, 0) DESC, COALESCE(ds.discount_amount, 0) ASC, NEWID()
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
    //console.log(data);
    if(data.success && data.results)
    {
        var categs = [];
        data.results.recordset.forEach((item)=>
        {
             //console.log(item);
             if(categs.filter(ct => ct.name == item.category_name).length == 0){
                  categs.push({name: item.category_name , idx: item.idx});
             }
             
             let popular = new DOMParser().parseFromString( `
            <div class="popular-pick nav-link" href="#product" queries="${'product=' + item.idx}" >
                <img src="" alt="" >
                <p>
                ${item.brand_name && item.brand_name != '' ? `
                <span>${item.product_name}</span> supplied by <span> ${item.brand_name} </span>
                ` : ''} 
                </p>
                <p>
                    <span class="current-price"> R ${item.discount_amount > 0 ? item.new_price : item.original_price} </span>
                    ${item.discount_amount > 0 ? `
                    <span class="original-price">R ${item.original_price} </span>
                    <span class="savings">-${item.discount_amount}%</span>` : ''}
                    
                </p>
                <div class="rating"> 
                    ${(()=>{
                         var ret = "";

                         for(var k= 0; k < 5; k++){
                    		if(k < parseInt(item.average_rating))
                    		{
                    		    ret += `<i class="fas fa-star"></i>`;
                    		}
                    	     else{
                    		    ret += `<i class="far fa-star"></i>`;
                    	     }
                    	 }

                         return ret;
                    })()}
                    <span>(${item.review_count} reviews)</span>
                </div>
            </div>`, 
              "text/html").body.firstChild;
 
             const img = popular.querySelector("img");
               
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

             document.querySelector('.popular-picks-grid.final').appendChild(popular);
        });

         document.querySelector(".departments-buttons.final").innerHTML = '';
         categs.forEach((item)=>{
               let categ = new DOMParser().parseFromString( `
                  <label class="button nav-link" href="#products" queries="${'category=' + item.idx}">
                     <span> ${item.name }</span>
                     <input type="radio" name="department" value="${item.name}">
                     <div></div>
                 </label>
                 `,  "text/html").body.firstChild;

               document.querySelector(".departments-buttons.final").innerHTML += categ.outerHTML;
         });
    }
})
.catch((error) => {
    console.error(error);
});

// Related Categories

query = `
     WITH RankedCategories AS (
       SELECT 
         c.idx, 
         c.category_name, 
         SUM(pc.quantity) AS item_count,
         ROW_NUMBER() OVER (ORDER BY SUM(pc.quantity) DESC) AS row_num
       FROM Categories c
       LEFT JOIN Products p ON c.idx = p.category_no
       LEFT JOIN Product_Cart pc ON p.idx = pc.product_no
       GROUP BY c.idx, c.category_name
     )
     SELECT TOP 16 
       idx, 
       category_name, 
       COALESCE(item_count, 0) AS item_count
     FROM (
       SELECT 
         idx, 
         category_name, 
         item_count,
         row_num
       FROM RankedCategories
       UNION ALL
       SELECT 
         c.idx, 
         c.category_name, 
         NULL AS item_count,
         NULL AS row_num
       FROM Categories c
       WHERE c.idx NOT IN (SELECT idx FROM RankedCategories)
     ) AS combined
     GROUP BY idx, category_name, item_count
     ORDER BY MIN(row_num), NEWID()
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
    //console.log(data);
    if(data.success && data.results)
    { 
        data.results.recordset.forEach((item)=>
        {
             //console.log(item); 
             let categ = new DOMParser().parseFromString( `
                 <label class="button nav-link" href="#products" queries="${'category=' + item.idx}">
                     <span>${item.category_name}</span>
                     <input type="radio" name="related-category" value="${item.category_name}">
                     <div></div>
                 </label>`, 
              "text/html").body.firstChild;
  
             document.querySelector('.related-categories-buttons.final').appendChild(categ);
        });
 
    }
})
.catch((error) => {
    console.error(error);
});

// Tips and Guides

query = `
SELECT 
  tg.idx,
  tg.category_no,
  c.category_name,
  tg.tip,
  tg.title, 
  p.idx AS product_idx
FROM 
  Tips_and_Guides tg
  INNER JOIN Categories c ON tg.category_no = c.idx
  LEFT JOIN (
    SELECT 
      category_no,
      idx,
      ROW_NUMBER() OVER (PARTITION BY category_no ORDER BY NEWID()) AS row_num
    FROM 
      Products
  ) p ON tg.category_no = p.category_no AND p.row_num = 1
WHERE 
  p.idx IS NOT NULL
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
    //console.log(data);
    if(data.success && data.results)
    { 
        data.results.recordset.forEach((item)=>
        { 
             let popular = new DOMParser().parseFromString( `
             <div class="guide-item">
                <img src="" alt="">
                <h4>${item.category_name}</h4>
                <p>Tip: ${atob(item.tip)}</p>
                <span> ${item.title} </span>
            </div>`, 
              "text/html").body.firstChild;
 
             const img = popular.querySelector("img");
               
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Products&tableIdx=${item.product_idx}`)
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

             document.querySelector('.guide-list.final').appendChild(popular);
        }); 
    }
})
.catch((error) => {
    console.error(error);
});

// Blog 

query = `
SELECT TOP 1 
  idx,
  title,
  intro,
  content
FROM 
  Blogs
ORDER BY 
  NEWID()
  `;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
    console.log(data);
    if(data.success && data.results)
    { 
        if(data.results.recordset)
        {
             console.log(data.results.recordset);
             console.log(data.results.recordset.length);
             
             if(data.results.recordset.length > 0)
             {
                  var res = data.results.recordset[0];

                  document.querySelector(".article-section .title").innerHTML = res.title;
                  document.querySelector(".article-section .intro").innerHTML = atob(res.intro);
                  document.querySelector(".article-section .article-content").innerHTML = atob(res.content);
                  document.querySelector(".article-section").style.opacity = 1; 
             }
        } 
    }
})
.catch((error) => {
    console.error(error);
});

// Article Section

const readMoreButton = document.querySelector('.read-more');
const articleContent = document.querySelector('.article-content');
const readLessButton = document.querySelector('.read-less');

readMoreButton.addEventListener('click', () => {
    articleContent.style.display = 'block';
    readMoreButton.style.display = 'none';
    readLessButton.style.display = 'block';
});

readLessButton.addEventListener('click', () => {
    articleContent.style.display = 'none';
    readMoreButton.style.display = 'block';
    readLessButton.style.display = 'none';
});

// Departments Section

const departmentButtons = document.querySelectorAll('.department-button');

departmentButtons.forEach(button => {
    button.addEventListener('click', () => {
        const departmentName = button.textContent;
        console.log(`Department: ${departmentName}`);
    });
});

// Popular Picks Section

const popularPickButtons = document.querySelectorAll('.popular-pick button');

popularPickButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popularPickName = button.textContent;
        console.log(`Popular Pick: ${popularPickName}`);
    });
});

// Related Categories Section

const relatedCategoryButtons = document.querySelectorAll('.related-category-button');

relatedCategoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const relatedCategoryName = button.textContent;
        console.log(`Related Category: ${relatedCategoryName}`);
    });
});

// Related Searches Section

const relatedSearchButtons = document.querySelectorAll('.related-search-button');

relatedSearchButtons.forEach(button => {
    button.addEventListener('click', () => {
        const relatedSearchName = button.textContent;
        console.log(`Related Search: ${relatedSearchName}`);
    });
});

// Discounts Section

const discountButtons = document.querySelectorAll('.discount button');

discountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const discountName = button.textContent;
        console.log(`Discount: ${discountName}`);
    });
});

// Tips and Guides Section

const tipButtons = document.querySelectorAll('.tip button');

tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tipName = button.textContent;
        console.log(`Tip: ${tipName}`);
    });
});

// Department Filtering

const departmentFilters = document.querySelectorAll('.department-filter');

departmentFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const departmentName = filter.textContent;
        console.log(`Department Filter: ${departmentName}`);
    });
});

// Search Functionality

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    console.log(`Search Term: ${searchTerm}`);
});

// Mobile Navigation

const mobileNavButton = document.querySelector('.mobile-nav-button');
const mobileNavMenu = document.querySelector('.mobile-nav-menu');

mobileNavButton.addEventListener('click', () => {
    mobileNavMenu.classList.toggle('open');
});

// Scroll to Top

const scrollTopButton = document.querySelector('.scroll-top-button');

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


