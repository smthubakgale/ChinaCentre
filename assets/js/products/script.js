let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');
let Params = getQueryParams(urs);  
console.log(Params);

loadProducts();

window.limit = 30;
window.offset = 0;
window.currentPage = 1;
window.totalPages = 1;
let WhereClause = '';

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

function loadProducts(){
  let bid = Params['brand'];
  let cid = Params['category'];
  let did = Params['discount'];

  let query = '';
  let query2 = '';

  window.loadTableData = function(){
    if(did){
      query = `
      WITH RankedProducts AS (
        SELECT 
          ds.idx AS d_idx , 
          p.idx, 
          p.product_name, 
          p.item_no,
          p.main_dimension,
          p.main_feature,
          p.main_material,
          p.price AS original_price,
          p.barcode,
          p.quantity,
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
        WHERE ds.idx = ${did} AND ds._status = 'Public' ${WhereClause}
        ORDER BY p.idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      )
      SELECT
        d_idx , 
        idx, 
        product_name, 
        item_no,
        main_dimension,
        main_feature,
        main_material,
        original_price,
        barcode,
        quantity,
        discount_value,
        new_price,
        department_name, 
        category_name,
        discount_no,
        discount_amount,
        end_date,
        discount_name
      FROM RankedProducts
      WHERE d_idx = ${did} AND row_num = 1 ${WhereClause != '' ? "AND " + WhereClause : WhereClause}
      ORDER BY discount_amount ASC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      `; 
    }
    else if(cid){
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
      p.category_no = ${cid}; ${WhereClause != '' ? "AND " + WhereClause : WhereClause}
    ORDER BY p.idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
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
      p.brand_no = ${bid}; ${WhereClause != '' ? "AND " + WhereClause : WhereClause}
    ORDER BY p.idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      `; 
    }
    else
    {
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
        ${WhereClause != '' ? "WHERE " + WhereClause : WhereClause}
        ORDER BY p.idx OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      `;  
    }

  console.log(query);
    
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
                  
                 img.alt = item.product_name;
               
                   document.querySelector(".products-container.final").appendChild(product);
             });
          }
      })
      .catch((error) => {
          console.error(error);
      }); 
    } 
  }

  window.updateCount = function(callback = ()=>{}){
     if(did){ 
        query2 = `
          WITH RankedProducts AS (
            SELECT 
              ds.idx AS d_idx , 
              p.idx, 
              p.product_name, 
              p.item_no,
              p.main_dimension,
              p.main_feature,
              p.main_material,
              p.price AS original_price,
              p.barcode,
              p.quantity,
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
            WHERE ds.idx = ${did} AND ds._status = 'Public' ${WhereClause}
          )
          SELECT 
            COUNT(*) 
          FROM RankedProducts
          WHERE d_idx = ${did} AND row_num = 1 ${WhereClause != '' ? "AND " + WhereClause : WhereClause};
        `;
      }
      else if(cid){
        query2 = `
        SELECT 
          COUNT(*) 
        FROM 
          Products p
          INNER JOIN Categories c ON p.category_no = c.idx
          INNER JOIN Brands b ON p.brand_no = b.idx
        WHERE 
          p.category_no = ${cid} ${WhereClause != '' ? "AND " + WhereClause : WhereClause};
        `;
      }
      else if(bid){
         query2 = `
          SELECT 
            COUNT(*) 
          FROM 
            Products p
            INNER JOIN Categories c ON p.category_no = c.idx
            INNER JOIN Brands b ON p.brand_no = b.idx
          WHERE 
            p.brand_no = ${bid} ${WhereClause != '' ? "AND " + WhereClause : WhereClause};
        `;
      }
      else{
        query2 = `
          SELECT 
            COUNT(*) 
          FROM 
            Products p
            INNER JOIN Categories c ON p.category_no = c.idx
            INNER JOIN Brands b ON p.brand_no = b.idx 
          ${WhereClause != '' ? "WHERE " + WhereClause : WhereClause}
        `;
      }

      console.log(query2);
    
      if(query2 != ''){
        
        fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query2)}`)
          .then((response) => response.json())
          .then((data) => { 
               console.log(data);
              if(data.success && data.results)
              { 
    		            let totalCount = data.results.recordset[0][''];
    		            
    		            // Set default limit and offset
    		            window.limit = 10;
    		            window.offset = 0;
    		            window.currentPage = 1;
    		            window.totalPages = Math.ceil(totalCount / limit);
                
                    updatePaginationNumbers();
                    callback();
              }
          })
          .catch((error) => {
              console.error(error);
          }); 
      } 
   } 

	
  window.updateCount(()=>{
    loadTableData();
  });
  
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











