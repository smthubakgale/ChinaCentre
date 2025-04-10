let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');
let Params = getQueryParams(urs);  
console.log(Params);

loadProducts();

function loadProducts(){
  let bid = Params['brand'];
  let cid = Params['category'];

  let query = '';
  if(cid){
    query = `
     SELECT 
    p.idx,
    p.product_name,
    p.item_no,
    p.main_dimension,
    p.main_feature,
    p.main_material,
    p.price,
    p.barcode,
    p.quantity,
    c.category_name,
    b.brand_name,
    p.availability
  FROM 
    Products p
    INNER JOIN Categories c ON p.category_no = c.idx
    INNER JOIN Brands b ON p.brand_no = b.idx
  WHERE 
    p.category_no = ${cid};
    `;
  }
  else if(bid){
    query = `
      SELECT 
    p.idx,
    p.product_name,
    p.item_no,
    p.main_dimension,
    p.main_feature,
    p.main_material,
    p.price,
    p.barcode,
    p.quantity,
    c.category_name,
    b.brand_name,
    p.availability
  FROM 
    Products p
    INNER JOIN Categories c ON p.category_no = c.idx
    INNER JOIN Brands b ON p.brand_no = b.idx
  WHERE 
    p.brand_no = ${bid};
    `;
  }
  else{
    query = `
      SELECT 
    p.idx,
    p.product_name,
    p.item_no,
    p.main_dimension,
    p.main_feature,
    p.main_material,
    p.price,
    p.barcode,
    p.quantity,
    c.category_name,
    b.brand_name,
    p.availability
  FROM 
    Products p
    INNER JOIN Categories c ON p.category_no = c.idx
    INNER JOIN Brands b ON p.brand_no = b.idx 
    `;    
  }

  if(query != '')
  {
      fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
      .then((response) => response.json())
      .then((data) => { 
           console.log(data);
          if(data.success && data.results)
          {
             document.querySelector(".products-container.final").innerHTML = "";
             
             data.results.recordset.forEach((item)=>{
                 let product =  new DOMParser().parseFromString( `
                      <div class="product-item">
                        <img class="nav-link" href="#product" queries="${'product=' + item.idx}" src="" alt="">
                        <h5>${item.product_name}</h5>
                        <p><span class="old-price">R 999.99</span> R 699.99</p>
                        <button class="carts"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
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
               
                   document.querySelector(".products-container.final").appendChild(product);
             });
          }
      })
      .catch((error) => {
          console.error(error);
      }); 
  } 
}

const filterBtn = document.querySelector('.filter-btn');
const filterAside = document.querySelector('.filter-aside');
const closeButton = document.querySelector('.filter-close');

const sortContainer = document.querySelector('.sort-container');
const sortOptions = document.querySelector('.sort-options');
const chevronIcon = document.querySelector('.chevron-icon i');

const showMoreBtn = document.querySelector('.show-more-btn');
const additionalColorOptions = document.querySelector('.additional-color-options');
const showLessBtn = document.querySelector('.show-less-btn');

// Pop Up 
filterBtn.addEventListener('click', () => {
  filterAside.classList.toggle("pop-show");
});

closeButton.addEventListener('click', () => {
  filterAside.classList.remove("pop-show");
});

// Aside Sort 
sortContainer.addEventListener('click', () => {
  if (sortOptions.style.display === 'none') {
    sortOptions.style.display = 'block';
    chevronIcon.className = 'fas fa-chevron-up';
  } else {
    sortOptions.style.display = 'none';
    chevronIcon.className = 'fas fa-chevron-down';
  }
});

// Aside : Show More 
showMoreBtn.addEventListener('click', () => {
    additionalColorOptions.style.display = 'flex';
    showMoreBtn.style.display = 'none';
    showLessBtn.style.display = 'block';
});

showLessBtn.addEventListener('click', () => {
    additionalColorOptions.style.display = 'none';
    showMoreBtn.style.display = 'block';
    showLessBtn.style.display = 'none';
});











