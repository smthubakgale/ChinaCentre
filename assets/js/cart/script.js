const cartPageElement = document.querySelector('.cart-page');

loadCart2(true);
function loadCart2(ini = false){
  var cart_total = document.querySelector(".summary-item-value span"); 
  cart_total.style.opacity = 0;
	
  // code to load cart data goes here 
  let query = `
    SELECT 
  b.idx AS idx, 
  d2.email AS user_no, 
  d3.idx AS product_no, 
  d3.product_name AS product_name, 
  d3.main_dimension AS main_dimension, 
  d3.main_feature AS main_feature, 
  d3.price AS original_price, 
  COALESCE(ds.discount_amount, 0) AS discount_amount,
  (d3.price * COALESCE(ds.discount_amount, 0) / 100) AS discount_value,
  (d3.price - (d3.price * COALESCE(ds.discount_amount, 0) / 100)) AS discounted_price,
  b.quantity AS quantity, 
  b.checkout_status AS checkout_status
FROM 
  Product_Cart b
  INNER JOIN Users d2 ON b.user_no = d2.idx
  INNER JOIN Products d3 ON b.product_no = d3.idx
  LEFT JOIN Discount_Items di ON d3.idx = di.product_no
  LEFT JOIN Discounts ds ON di.discount_no = ds.idx AND ds._status = 'Public'
WHERE 
  b.checkout_status = 'Shopping' 
ORDER BY 
  b.idx
  `;

  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      //console.log(data); 
      if(data.success && data.results)
      {
         var cart_count = document.querySelector(".cart-count span");
         var cart_desc = document.querySelector(".cart-description span");	      
         
         cart_count.innerHTML = data.results.recordset.length;
         cart_desc.innerHTML = data.results.recordset.length;
	 document.querySelector('.cart-items.final').innerHTML = '';

        let total = 0.0;
        
         data.results.recordset.forEach((item)=>
         {
             //console.log(item); 
              
             let product = new DOMParser().parseFromString(
              `
              
        <div class="cart-item"> 
          <div class="item-image">
            <div class="image-overlay">
              <img  src="" class="nav-link" href="#product"  queries="${'product=' + item.product_no}" src="" alt="">
            </div>
            <div class="item-details">
              <div class="item-description">
                <a href="#"> 
		             ${item.main_dimension && ['' , 'null'].indexOf(item.main_dimension) == -1 ? `<span class="dimension">${item.main_dimension}</span> cm` : ''} 
                  <span class="product-name">${item.product_name}</span> 
                  
			  ${item.main_feature && ['' , 'null'].indexOf(item.main_feature) == -1 ? 
			  ` With <span class="product-feature">${item.main_feature}</span>`: ''}  
                </a>
              </div>
              <div class="item-manufacturer">
                by <span>Latitude Run</span>
              </div>
              <div class="item-rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-half"></i>
                <span>(12 reviews)</span>
              </div>
              <div class="item-fabric">
                Fabric: <span>Vivi Gray Cotton/Corduroy</span>
              </div>
            </div>
          </div>
          <div class="item-actions">
            <div class="item-prices">
              <div class="new-price">
                R<span id="new-price">${item.discounted_price ? item.discounted_price : item.price}</span>
              </div>
	      ${ item.discounted_price ? `
                 <div class="old-price">
                   R<span id="old-price"> ${item.discounted_price} </span>
                   </div>`:''
	      }
            </div>
            <div class="item-quantity">
              <span>Qty</span> 
              <input type="number" style="border:none; outline:none; text-align:center; width:80px; height:100%;" value="${item.quantity}" min="1"> 
            </div> 
            <div class="cart-actions">
              <div class="trash-icon">
                <i class="fa fa-trash"></i>
              </div>
            </div>
          </div> 
        </div>
                `, 
               "text/html").body.firstChild;

               const img = product.querySelector("img");
               const qtyInput = product.querySelector(".item-quantity input");
	       const deleteButton = product.querySelector('.trash-icon');

                let timeoutId = null;

		deleteButton.addEventListener('click', () => {
		     window.ptable = 'Product_Cart';
		     window.pcallback = loadCart2;
		    // Set the idx property to the modal
		    document.querySelector('#delete-item-modal0').idx = item.idx;
    
		    // Show the modal 
		    document.querySelector('#delete-item-modal0').action = "Row"; 
		    document.querySelector('#delete-item-modal0').style.display = 'block';
		    document.querySelector('#delete-item-modal0').classList.add('show');
		    // 
		});
		 
                qtyInput.addEventListener('input', () => {
                  clearTimeout(timeoutId);
                  timeoutId = setTimeout(() => {
                    const qtyValue = qtyInput.value;
                    //console.log(qtyValue);
                    
                    let query = `
                    UPDATE Product_Cart 
		    SET quantity = '${qtyValue}'
		    WHERE idx = '${item.idx}' `;

                    //console.log(query);

                    fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
                    .then((response) => { 
                        return response.json();
                    })
                    .then((data) => {
                        //console.log(data); 
                        if(data.success){
                           loadCart2();
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                                      
                  }, 1000); // wait 1 second
                });

               total += parseFloat(item.quantity)*parseFloat(item.price)

               fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Products&tableIdx=${item.product_no}`)
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
           
              document.querySelector('.cart-items.final').appendChild(product);
         });

        cart_total.innerHTML = addSpaces(total.toFixed(2).toString()); 
	      cart_total.style.opacity = 1;
      }
 
  })
  .catch((error) => {
      console.error(error);
  }); 
}
/*
// Cart Total Calculator 
function calculateSubtotal(quantity, price) {
  return quantity * price;
}

function updateSubtotalDisplay(subtotal) {
  const subtotalElement = document.querySelector('.subtotal-price span');
  subtotalElement.textContent = subtotal.toFixed(2);
}

function updateTotalDisplay(total) {
  const totalElement = document.querySelector('.total .summary-item-value span');
  totalElement.textContent = total.toFixed(2);
}

function handleCartPageChange() {
  const quantityElement = document.querySelector('.item-quantity select');
  const priceElement = document.querySelector('.new-price span');
  const quantity = parseInt(quantityElement.value);
  const price = parseFloat(priceElement.textContent);
  const subtotal = calculateSubtotal(quantity, price);
  updateSubtotalDisplay(subtotal);
  updateTotalDisplay(subtotal);
}

const selectElement = cartPageElement.querySelector('select');
selectElement.addEventListener('change', () => { 
  handleCartPageChange();
});

const observer = new MutationObserver(()=>
{ 
   handleCartPageChange();
});

observer.observe(cartPageElement, {
  childList: true,
  subtree: true, 
});

handleCartPageChange();
*/ 
