
let req_page = true;
let has_addr = false;

let del = document.querySelector(".delivery-mode");
if(req_page){
   req_page = false;
  del.addEventListener("change", (e) => {
     localStorage.setItem('chinacentre-delivery', e.target.value);
     require_delivery = e.target.value;
     console.log(require_delivery);
     console.log(e.target);

     if(require_delivery == "require-delivery"){ 
       shippingSection.style.display = 'block';
     }
     else { 
       shippingSection.style.display = 'none';
     }
	  
  });
}

const shippingSection = document.querySelector('.shipping-section');

if(require_delivery == "require-delivery"){
   del.value = "require-delivery";
   shippingSection.style.display = 'block';
}
else {
   del.value = "store-collection";  
   shippingSection.style.display = 'none';
}

// 0. Checkout 
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (!has_addr && require_delivery == "require-delivery") {
        flashMessage('Address missing for delivery', 'error');
    } else {
        const paymentMethodSelect = document.getElementById('payment-method-select');
        const creditCardForm = document.getElementById('credit-card-form');
        const debitCardForm = document.getElementById('debit-card-form');
        const bankTransferForm = document.getElementById('bank-transfer-form');

        const paymentMethod = paymentMethodSelect.value;
        const data = {
            method: paymentMethod === 'credit-card' ? 'Credit Card' : paymentMethod === 'debit-card' ? 'Debit Card' : 'Bank Transfer',
	    session: encodeURIComponent(session)
        };

        if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
	    const cardNumber = paymentMethod === 'credit-card' ? creditCardForm.querySelector('#card-number').value : debitCardForm.querySelector('#card-number').value;
	    const expMonth = paymentMethod === 'credit-card' ? creditCardForm.querySelector('#exp-month').value : debitCardForm.querySelector('#exp-month').value;
	    const expYear = paymentMethod === 'credit-card' ? creditCardForm.querySelector('#exp-year').value : debitCardForm.querySelector('#exp-year').value;
	    const cvv = paymentMethod === 'credit-card' ? creditCardForm.querySelector('#cvv').value : debitCardForm.querySelector('#cvv').value;
	
	    if (!cardNumber) {
	        flashMessage('Card number is required', 'error');
	        return;
	    }
	    if (!expMonth) {
	        flashMessage('Expiration month is required', 'error');
	        return;
	    }
	    if (!expYear) {
	        flashMessage('Expiration year is required', 'error');
	        return;
	    }
	    if (!cvv) {
	        flashMessage('CVV is required', 'error');
	        return;
	    }
	
	    data.card_number = cardNumber;
	    data.expiration_month = expMonth;
	    data.expiration_year = expYear;
	    data.CCV = cvv;
	} else if (paymentMethod === 'bank-transfer') {
	    const bankName = bankTransferForm.querySelector('#bank-name').value;
	    const accountNumber = bankTransferForm.querySelector('#account-number').value;
	    const branchCode = bankTransferForm.querySelector('#branch-code').value;
	    const reference = bankTransferForm.querySelector('#reference').value;
	
	    if (!bankName) {
	        flashMessage('Bank name is required', 'error');
	        return;
	    }
	    if (!accountNumber) {
	        flashMessage('Account number is required', 'error');
	        return;
	    }
	    if (!branchCode) {
	        flashMessage('Branch code is required', 'error');
	        return;
	    }
	    if (!reference) {
	        flashMessage('Reference is required', 'error');
	        return;
	    }
	
	    data.bank_name = bankName;
	    data.account_number = accountNumber;
	    data.branch_code = branchCode;
	    data.reference = reference;
	}

        const queryParams = new URLSearchParams(data).toString();
        fetch(d_config.url + `checkout?${queryParams}`)
            .then(response => response.json())
            .then((data) => {
		    console.log(data);
	    })
            .catch(error => console.error('Error:', error));
    }
});
// 1. User Info 

const url2 = d_config.url + `get-user?session=${encodeURIComponent(session)}`;
	
fetch(url2)
.then((response) => response.json())
.then((data) => 
{
    console.log(data); 
	
    if(data.success)
    {
       let dets = document.querySelector(".udets");
       
       dets.innerHTML = `<span> ${data.user.firstname} </span> <span> ${data.user.lastname} </span`;
       dets.style.opacity = 1; 

       document.querySelector("#phone-number").value = data.user.phonenumber;
    }
})
.catch((error) => {
    console.error(error);
});

// Cart 
loadCart3();
function loadCart3(){
  var cart_total = document.querySelectorAll(".summary-item-value span"); 
  cart_total.forEach((item)=>{ item.style.opacity = 0;})
	
  query = `
	SELECT 
	  b.idx AS idx, 
	  d2.email AS user_no, 
	  d3.idx AS product_no, 
	  d3.product_name AS product_name, 
	  d3.main_dimension AS main_dimension, 
	  d3.main_feature AS main_feature, 
	  d3.main_material AS main_material, 
	  d3.price AS original_price, 
	  COALESCE(ds.discount_amount, 0) AS discount_amount,
	  (d3.price * COALESCE(ds.discount_amount, 0) / 100) AS discount_value,
	  (d3.price - (d3.price * COALESCE(ds.discount_amount, 0) / 100)) AS discounted_price,
	  b.quantity AS quantity, 
	  b.checkout_status AS checkout_status,
	  COALESCE(pr.avg_rating, 0) AS average_rating,
	  (SELECT COUNT(*) FROM Product_Reviews WHERE product_no = d3.idx) AS review_count,
	  COALESCE(br.brand_name, 'Unknown Brand') AS brand_name,
	  COALESCE(c.category_name, 'Unknown Category') AS category_name
	FROM 
	  Product_Cart b
	  INNER JOIN Users d2 ON b.user_no = d2.idx
	  INNER JOIN Products d3 ON b.product_no = d3.idx
	  LEFT JOIN Brands br ON d3.brand_no = br.idx
	  LEFT JOIN Categories c ON d3.category_no = c.idx
	  LEFT JOIN Discount_Items di ON d3.idx = di.product_no
	  LEFT JOIN Discounts ds ON di.discount_no = ds.idx AND ds._status = 'Public'
	  LEFT JOIN (
	    SELECT 
	      product_no, 
	      AVG(rating) AS avg_rating
	    FROM 
	      Product_Ratings
	    GROUP BY 
	      product_no
	  ) pr ON d3.idx = pr.product_no
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
	      console.log(data); 
	      if(data.success && data.results)
	      {
		 var cart_count = document.querySelector(".summary-header span");  	      
		 
		 cart_count.innerHTML = data.results.recordset.length; 
		 cart_count.style.opacity = 1;
		       
		 document.querySelector('.hidden.final').innerHTML = '';
	
		let total = 0.0;
		
		 data.results.recordset.forEach((item)=>
		 {
		     //console.log(item); 
		      
		     let product = new DOMParser().parseFromString( `  
			<div class="fleco" >
			  <div class="image-container">
			    <img class="nav-link" href="#product"  queries="${'product=' + item.product_no}" src="" alt="">
			    <div class="price-remove">
			      <div>R <span class="price">${parseFloat(item.discount_amount) > 0 ? item.discounted_price : item.original_price}</span> x ${item.quantity}</div>
			      <p><a href="#" class="trash-icon">Remove</a></p>
			    </div>
			  </div>
			  <div class="product-details">
			    <p>
				 <span class="brand-name"> ${item.brand_name} </span>
                                 <span class="product-type">${item.category_name}</span>
				 ${item.main_dimension && ['' , 'null'].indexOf(item.main_dimension) == -1 ? `<span class="dimension">${item.main_dimension}</span> cm` : ''} 
				 
			   </p>
			    <p><span class="product-name">${item.product_name}</span> ${item.main_feature && ['' , 'null'].indexOf(item.main_feature) == -1 ? 
			  ` With <span class="product-feature">${item.main_feature}</span>`: ''} </p>
			    <p>${item.main_material ? `Fabric: <span class="material">${item.main_material}</span>` : ''}</p>
			  </div> 
			</div> 
			`, 
		       "text/html").body.firstChild;
	
		       const img = product.querySelector("img"); 
		       const deleteButton = product.querySelector('.trash-icon');
	
			let timeoutId = null;
	
			deleteButton.addEventListener('click', () => {
			     window.ptable = 'Product_Cart';
			     window.pcallback = loadCart3;
			    // Set the idx property to the modal
			    document.querySelector('#delete-item-modal0'.replace('#cart ' , '')).idx = item.idx;
	    
			    // Show the modal 
			    document.querySelector('#delete-item-modal0'.replace('#cart ' , '')).action = "Row"; 
			    document.querySelector('#delete-item-modal0'.replace('#cart ' , '')).style.display = 'block';
			    document.querySelector('#delete-item-modal0'.replace('#cart ' , '')).classList.add('show');
			    // 
			});
			  
		       total += parseFloat(item.quantity)*parseFloat(parseFloat(item.discount_amount) > 0 ? item.discounted_price : item.original_price);
	
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
		   
		      document.querySelector('.hidden.final').appendChild(product);
		 });
	
		cart_total.forEach((item)=>{ item.innerHTML = addSpaces(total.toFixed(2).toString()); });
		cart_total.forEach((item)=>{ item.style.opacity = 1; }); 
		      
	      }
	 
	  })
	  .catch((error) => {
	      console.error(error);
	  });  
	
}

// Shipping Address

loadShipping();
function loadShipping(){
    let query =  `
	SELECT 
	  idx,  
	  address, 
	  region, 
	  apartment, 
	  province, 
	  city ,
          phone_number ,
	  postal_code 
	FROM 
	  Checkout_Addresses
	WHERE 
	  is_shipping = 'YES'
`;

  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      console.log(data); 
      if(data.success && data.results)
      {
	 if(data.results.recordset.length == 0){
	   shippingInfo.classList.remove("edit-change"); 
	   shippingInfo.classList.add("edit-change");

	   let query2 = `
		SELECT 
		  idx,  
		  address, 
		  region, 
		  apartment, 
		  province, 
		  city ,
                  phone_number ,
		  postal_code
		FROM 
		  Checkout_Addresses
	      `;

		  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
		  .then((response) => { 
		      return response.json();
		  })
		  .then((data) => {
		      console.log(data); 
		      if(data.success && data.results)
		      {
			 if(data.results.recordset.length == 0){
			      document.querySelector(".address-select select").style.opacity = 0;
			      document.querySelector(".delete-button").style.opacity = 0;
			      document.querySelector(".save-button-container").style.display = "block"; 

			      address_action = "first_address";
			      document.getElementById('shipping-address').checked = true;
                              document.getElementById('shipping-address').disabled = true;
			 }
			 else{
			      document.querySelector(".address-select select").style.opacity = 1;
			      document.querySelector(".delete-button").style.opacity = 1;
			      document.querySelector(".save-button-container").style.display = "block"; 
				 
			      address_action = "extra_address";
			      document.getElementById('shipping-address').checked = false;
                              document.getElementById('shipping-address').disabled = false;
			 }
		      }
		  })
		  .catch((error) => {
		      console.error(error);
		  });
		 
	 }
	 else {
	     shippingInfo.classList.remove("edit-change");

	      document.querySelector(".edit-button").style.opacity = 1;
	      document.querySelector(".change-button").style.opacity = 1;
	      document.querySelector(".address-select select").style.opacity = 1;
	      document.querySelector(".delete-button").style.opacity = 1;
	      document.querySelector(".save-button-container").style.display = "block"; 
		 
	      address_action = "extra_address";
	      document.getElementById('shipping-address').checked = false;
	      document.getElementById('shipping-address').disabled = false;
		 
	      let res = data.results.recordset[0]; 

	      document.querySelector(".address-details .addr").innerHTML = `
                <p>
		   <span> ${res.address} </span>, 
		   <span> ${res.apartment} </span>, 
		   <span> ${res.region} </span>, 
		   <span> ${res.city} </span> 
		   <span> ${res.postal_code} </span>
		 </p>
		 <p> ${res.phone_number} </p>
                `;
		 
	      document.querySelector(".address-details .addr").style.opacity = 1;
	      // Form 
              document.querySelector("#form1 #address").value = res.address;
              document.querySelector("#form1 #apt-suite-unit-etc").value = res.apartment;
              document.querySelector("#form1 #region").value = res.region; 
              document.querySelector("#form1 #postal-code").value = res.postal_code; 
              document.querySelector("#form1 #phone-number").value = res.phone_number; 
	      //
	 }
      }
  })
  .catch((error) => {
      console.error(error);
  });	
}
 
// Address Form 

let address_action = null;

const form = document.querySelector('.form1');

form.addEventListener('submit', function(event) {
event.preventDefault();

const formData = new FormData(form);
const data = Object.fromEntries(formData.entries());
data.shippingAddress = document.getElementById('shipping-address').checked ? "YES" : "NO";

// You can now use the form data as an object
console.log(data);
console.log(address_action);

   if(address_action == "first_address"){
	let query3 = `
		 INSERT INTO Checkout_Addresses (
		    address,
		    region,
		    apartment,
		    province,
		    city,
		    is_shipping ,
                    locked , 
		    phone_number ,
                    postal_code
		  )
		  VALUES (
		    '${data.address}',
		    '${data.region}',
		    '${data["apt-suite-unit-etc"]}',
		    '${data.province}',
		    '${data.city}',
		    '${data.shippingAddress}' ,
                    'NO' ,
                    '${data["phone-number"]}' ,
		    '${data["postal_code"]}'
		  )
             `;

	   console.log(query3); 

	    fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query3)}`)
	    .then((response) => { 
	        return response.json();
	     })
	   .then((data) => {
	      console.log(data); 
	      if(data.success && data.results)
	      {
		 loadShipping(); 
	      }
	    })
	   .catch((error) => {
	      console.error(error);
	   });
	   
   }

});
//

const shippingInfo = document.querySelector('.shipping-info'); 
const addressOptions = document.querySelector('.address-options');  

const changeButton = addressOptions.querySelector('.change-button');
const editButton = addressOptions.querySelector('.edit-button');
const deleteButton = addressOptions.querySelector('.delete-button');  

const paymentMethodSelect = document.getElementById('payment-method-select');
const paymentMethodForms = document.querySelectorAll('.payment-methods div[id$="-form-div"]');

const summaryHeader = document.querySelector('.summary-header');
const hiddenDiv = document.querySelector('.hidden');

summaryHeader.addEventListener('click', () => {
  const chevronIcon = summaryHeader.querySelector('i');
  if (chevronIcon.classList.contains('fa-chevron-down')) {
    chevronIcon.classList.remove('fa-chevron-down');
    chevronIcon.classList.add('fa-chevron-up');
    hiddenDiv.style.display = 'block';
  } else {
    chevronIcon.classList.remove('fa-chevron-up');
    chevronIcon.classList.add('fa-chevron-down');
    hiddenDiv.style.display = 'none';
  }
});
// 
paymentMethodSelect.addEventListener('change', () => {
  const selectedMethod = paymentMethodSelect.value;
  paymentMethodForms.forEach((form) => {
    if (form.id === `${selectedMethod}-form-div`) {
      form.style.display = 'block';
    } else {
      form.style.display = 'none';
    }
  });
});
// 
changeButton.addEventListener('click', () => {
  shippingInfo.classList.remove("edit-change");
  shippingInfo.classList.add("address-change");
});

editButton.addEventListener('click', () => {
  shippingInfo.classList.remove("address-change");
  shippingInfo.classList.add("edit-change");
});
//
function checkDeliveryMode() {
  const deliveryModeSelect = document.querySelector('.delivery-mode');
  const mainContainer = document.querySelector('.main-container');

  if (deliveryModeSelect.value === 'collection') {
    mainContainer.classList.add('m-delivery');
  } else {
    mainContainer.classList.remove('m-delivery');
  }
}

// Initially call the function
checkDeliveryMode();

// Call the function on change event listener
document.querySelector('.delivery-mode').addEventListener('change', checkDeliveryMode);
