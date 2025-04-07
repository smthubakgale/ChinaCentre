//
let session = localStorage.getItem('chinacentre');
let session_local = localStorage.getItem('chinacentre_local');

//setTimeout( session_login ,2000);
 
function loadCart() {
  const cartPopup = document.querySelector('.desktop .cart-popup');
  if (!cartPopup) return;
  try{document.querySelector('.desktop .cart-popup .design').remove();}catch{}
  document.querySelector('.desktop .cart-popup .final').innerHTML = '';
  var cart_total = document.querySelector(".subtotal-price span"); 
  cart_total.style.opacity = 0;
	
  // code to load cart data goes here
  //console.log('Loading cart data...');
  let query = `
    SELECT b.idx AS idx, d2.email AS user_no, d3.idx AS product_no , d3.product_name AS product_name, d3.main_dimension AS main_dimension , d3.main_feature AS main_feature ,  d3.price AS price , b.quantity AS quantity, b.checkout_status AS checkout_status
    FROM Product_Cart b, Users d2, Products d3
    WHERE b.user_no = d2.idx AND b.product_no = d3.idx AND b.checkout_status = 'Shopping' 
    ORDER BY b.idx 
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

        let total = 0.0;
        
         data.results.recordset.forEach((item)=>
         {
             //console.log(item); 
              
             let product = new DOMParser().parseFromString(
              `<div class="cart-item">
                  <div class="product-image">
                    <img src="" class="nav-link" href="#product"  queries="${'product=' + item.product_no}" src="" alt="">
                  </div>
                  <div class="product-details" style="flex:1;">
                    <div class="product-info">
                      <a href="#">
		      ${item.main_dimension && ['' , 'null'].indexOf(item.main_dimension) == -1 ? `<span class="product-size">${item.main_dimension}</span> cm` : ''} 
                        <span class="product-name">${item.product_name}</span> 
                        <span class="product-description">
			  ${item.main_feature && ['' , 'null'].indexOf(item.main_feature) == -1 ? 
			  `<span class="description-text">With</span> 
                          <span class="description-highlight">${item.main_feature}</span>`: ''} 
                        </span>
                      </a>
                    </div>
                    <div class="product-color">
                      Vivi Gray Cotton/Corduroy
                    </div>
                    <div class="product-actions">
                      <div class="quantity-selector">
                        <span class="qty-label">Qty</span>
                        <input type="number" style="border:none; outline:none; text-align:center; width:80px; height:100%;" value="${item.quantity}" min="1"> 
                      </div>
                      <div class="delete-icon">
                        <i class="fas fa-trash-alt"></i>
                      </div>
                      <div class="product-price">
                        R <span>${addSpaces(item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>`, 
               "text/html").body.firstChild;

               const img = product.querySelector("img");
               const qtyInput = product.querySelector(".quantity-selector input");
	       const deleteButton = product.querySelector('.delete-icon');

                let timeoutId = null;

		deleteButton.addEventListener('click', () => {
		     window.ptable = 'Product_Cart';
		     window.pcallback = loadCart;
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
                           loadCart();
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
           
              document.querySelector('.cart-popup .final').appendChild(product);
         });

        cart_total.innerHTML = addSpaces(total.toFixed(2).toString()); 
	cart_total.style.opacity = 1;
      }
 
  })
  .catch((error) => {
      console.error(error);
  }); 
}

function createDeleteModal(){
	 
	// Check if the modal already exists
	if (document.getElementById('delete-item-modal0')) {
	   return;
	}
 
	window.ptable = null;
	window.pcallback = null;
	
	// Create the modal HTML
	let deleteModalHtml = `
	    <div class="modal fade" id="delete-item-modal0" tabindex="-1" role="dialog" aria-labelledby="delete-item-modal-label" aria-hidden="true">
		<div class="modal-dialog" role="document">
		    <div class="modal-content">
			<div class="modal-header">
			    <h5 class="modal-title" id="delete-item-modal-label">Delete Item</h5>
			    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			    </button>
			</div>
			<div class="modal-body">
			    Are you sure you want to delete this item?
			</div>
			<div class="modal-footer">
			    <button type="button" class="btn btn-secondary" id="cancel-delete-item-btn">Cancel</button>
			    <button type="button" class="btn btn-danger" id="delete-item-btn">Delete</button>
			</div>
		    </div>
		</div>
	    </div>
	`;
	// Add the modal HTML to the page
	document.body.innerHTML += deleteModalHtml;
	 
	// Add event listener for delete item button
	document.querySelector('#delete-item-modal0 #delete-item-btn').addEventListener('click', (e) => {
	    e.preventDefault();

	    let button = document.querySelector('#delete-item-modal0');
	    let action = button.action;

	    //console.log(action);

	    if(action == "Row")
	    {
		// Get the idx from the modal
		let idx = button.idx;
	
		// Generate the delete query
		let query = `DELETE FROM ${window.ptable} WHERE idx = ${idx}`;
		//console.log(query); 
	
		// Send the delete query to the server
		fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
		 .then((response) => response.json())
		 .then((data) => {
		     //console.log(data);
		     if (data.success) {
			 // Callback Function 
		        if(window.pcallback){
			   window.pcallback();
		        } 
			// Hide the modal
			button.style.display = 'none';
		     } else {
			console.error(data.message);
		     }
		 })
		 .catch((error) => {
		    console.error(error);
		    // Hide the modal
		    button.style.display = 'none';
		 });
	    }
	    if(action == "File"){
		 const idx = button.getAttribute('idx');
		 const tableName = button.getAttribute('table_name');
		 const tableIdx = button.getAttribute('table_idx');

		 fetch(d_config.url + `delete-file?session=${encodeURIComponent(session)}&tableName=${encodeURIComponent(tableName)}` +
				      `&tableIdx=${encodeURIComponent(tableIdx)}&idx=${encodeURIComponent(idx)}`)
		    .then((response) => response.json())
		    .then((data) => {
			//console.log(data);
			// Callback Function 
		        if(window.pcallback){
			   window.pcallback(tableIdx);
		        }
			// Hide the modal
			button.style.display = 'none';
		    })
		    .catch((error) => {
			console.error(error);
			// Hide the modal
			button.style.display = 'none';
		    });
	    }
	});
	// Add event listener for cancel button
	document.querySelector('#delete-item-modal0 #cancel-delete-item-btn').addEventListener('click', () => {
	    let button = document.querySelector('#delete-item-modal0 #delete-item-modal');
	    // Hide the modal
	    button.style.display = 'none';
	});
	// 
}

function addSpaces(num) {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length === 1) {
    parts.push('00');
  }
  return parts.join('.');
}

function cart_add(idx , qty , is_qty = false){
  let query = `
    IF NOT EXISTS ( SELECT 1 FROM Product_Cart WHERE product_no = '${idx}' )
      INSERT INTO Product_Cart (product_no, quantity, checkout_status)
      VALUES ('${idx}', '${qty}', 'Shopping')
    ELSE
      UPDATE Product_Cart
      SET quantity = ${ is_qty ? "'" + qty + "'" : 'quantity + 1'}
      WHERE product_no = '${idx}'`;

  // Send the form data to the server using fetch API
  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      //console.log(data); 
    if(data.success){
      flashMessage('Added to Cart');
      loadCart();
    } 
  })
  .catch((error) => {
      console.error(error);
  }); 
}

function flashMessage(message, type = 'success') {
  //console.log(`Flash message: ${message} (${type})`);
  
  // Create the container element
  const flashMessageContainer = document.createElement('div');
  flashMessageContainer.id = 'flash-message';
  flashMessageContainer.style.position = 'fixed';
  flashMessageContainer.style.top = 'calc(100vh - 100px)';
  flashMessageContainer.style.left = 'calc(100vw - 180px)';
  flashMessageContainer.style.zIndex = '10000';
  flashMessageContainer.style.width = '160px';
  flashMessageContainer.style.textAlign = 'center';
  document.body.appendChild(flashMessageContainer);
  
  // Create the message element
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className = `flash-message ${type}`;
  messageElement.style.background = type === 'success' ? 'green' : 'red';
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.display = 'inline-block'; 
  
  // Add the message element to the container
  flashMessageContainer.appendChild(messageElement);
  
  // Fade out the message after 2 seconds
  setTimeout(() => {
    messageElement.style.opacity = 1;
    messageElement.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
      messageElement.style.opacity = 0;
      
      setTimeout(() => {
        messageElement.remove();
        flashMessageContainer.remove();
      }, 500);
    }, 2000);
  }, 0);
}

function session_login(count = 0 , callback = ()=>{})
{  
  //console.log(session_local);
  //console.log(session);
  
  if(session_local)
  {
       //console.log(session_local);
       session_local = (typeof session_local === 'object' && session_local !== null)?session_local : JSON.parse(session_local);
       //console.log(session_local);
    
       const expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
       const sessionTimestamp = new Date(session_local.timestamp).getTime();
       const currentTime = new Date().getTime();

       if (currentTime - sessionTimestamp > expirationTime)
       {
	  session_local = null; 
	  //console.log("logout");
          logout();
       }
       else 
       {
	 //console.log(session_local.usertype);
         login(session_local.usertype , callback);
       }
  }
  else if(session) 
  {
    const url = d_config.url + `session?session=${encodeURIComponent(session)}`;
    //console.log(url);
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
          //console.log(data);

        if(data.usertype){
            localStorage.setItem('chinacentre_local' , JSON.stringify({
              usertype: data.usertype ,
              timestamp: new Date().toISOString()
            })); 
          
            login(data.usertype , callback);
        }
        else {
          logout();
        } 
      })
      .catch((error) => {

        if(count < 10){
           //console.log(error);
           setTimeout(()=>{ session_login(count + 1 , callback); } , 500);
        }
        else {
          logout();
        }
      });
     //:
  } 
  else{
    login("default" , callback);
  } 
}

function login(usertype , callback = ()=>{}){ 
  //console.log(usertype);

  const inheritedUsers = getInheritedUsers(usertype);
  inheritedUsers.push(usertype); // include the user itself

  //console.log(inheritedUsers);

  const filteredPages = user_management.filter(page => page.users.some(user => (page.inherit == false ? [usertype].includes(user) : inheritedUsers.includes(user))));

  //console.log(filteredPages);
  
  // Remove unauthorized elements from the DOM
  const navLinks = document.querySelectorAll('.nav-link');
  Array.from(navLinks).forEach((link) => {
    const page = link.getAttribute('href').replace('#', '');
    if (!filteredPages.find(p => p.page === page)) {
      link.remove();
    }
  });

  document.body.style.opacity = 1;
  callback();
}

function logout(){

  if(!session && !session_local){
    localStorage.setItem('chinacentre_local' , JSON.stringify({
      usertype: 'default' ,
      timestamp: new Date().toISOString()
    }));
  }
  localStorage.removeItem('chinacentre');  

  login('default');
}


const user_inherits = [
  { user: "Developer", inherits: ["Admin"] },
  { user: "Admin", inherits: ["Customer"] },
  { user: "Customer", inherits: ["default"] },
];

function getInheritedUsers(user) {
  const inheritedUsers = [];
  const inherits = user_inherits.find(u => u.user === user);
  if (inherits) {
    inheritedUsers.push(...inherits.inherits);
    inherits.inherits.forEach(inheritedUser => {
      inheritedUsers.push(...getInheritedUsers(inheritedUser));
    });
  }
  return inheritedUsers;
}

const user_management = [
  { 
    "page": "more", 
    "users": ["default"] 
  }, 
  { 
    "page": "database", 
    "users": ["default"] 
  }, 
  { 
    "page": "home", 
    "users": ["default"] 
  }, 
  { 
    "page": "collections", 
    "users": ["default"] 
  },
  { 
    "page": "notifications", 
    "users": ["default"] 
  },
  { 
    "page": "register", 
    "users": ["default"] ,
    "inherit" : false
  },
  { 
    "page": "login", 
    "users": ["default"] ,
    "inherit" : false
  },
  { 
    "page": "profile-settings", 
    "users": ["Customer"] 
  },
  { 
    "page": "logout", 
    "users": ["Customer"] 
  },
  { 
    "page": "dashboard", 
    "users": ["Customer"] 
  },
  { 
    "page": "wishlist", 
    "users": ["Customer"] 
  },
  { 
    "page": "order-history", 
    "users": ["Customer"] 
  },
  { 
    "page": "payment-history", 
    "users": ["Customer"] 
  },
  { 
    "page": "address-book", 
    "users": ["Customer"] 
  },
  { 
    "page": "knowledge-base", 
    "users": ["default"] 
  },
  { 
    "page": "faqs", 
    "users": ["default"] 
  },
  { 
    "page": "glossary", 
    "users": ["default"] 
  },
  { 
    "page": "sitemap", 
    "users": ["default"] 
  },
  { 
    "page": "terms-of-use", 
    "users": ["default"] 
  },
  { 
    "page": "disclaimer", 
    "users": ["default"] 
  },
  { 
    "page": "privacy-policy", 
    "users": ["default"] 
  },
  { 
    "page": "shipping-policy", 
    "users": ["default"] 
  },
  { 
    "page": "payment-methods", 
    "users": ["default"] 
  },
  { 
    "page": "about", 
    "users": ["default"] 
  },
  { 
    "page": "blogs", 
    "users": ["default"] 
  },
  { 
    "page": "events-calendar", 
    "users": ["default"] 
  },
  { 
    "page": "affiliate-program", 
    "users": ["default"] 
  },
  { 
    "page": "careers", 
    "users": ["default"] 
  },
  { 
    "page": "loyalty-program", 
    "users": ["default"] 
  },
  { 
    "page": "community-forum", 
    "users": ["Customer"] 
  },
  { 
    "page": "contact", 
    "users": ["default"] 
  },
  { 
    "page": "customer-support", 
    "users": ["Customer"] 
  },
  { 
    "page": "tax-invoice", 
    "users": ["Customer"] 
  },
  { 
    "page": "cart", 
    "users": ["default"] 
  },
  { 
    "page": "checkout", 
    "users": ["default"] 
  },
  { 
    "page": "account", 
    "users": ["default"] 
  }
];

 
createDeleteModal(); 
try{
   loadCart();
}
catch(err){ console.error(err); }

