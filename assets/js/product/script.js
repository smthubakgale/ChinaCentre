let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');

//console.log(urs);

let Params = getQueryParams(urs);
let pid = Params['product'];

//console.log(Params , pid); 

if(pid){
   // Read Rating : All
   let query = `
	SELECT COALESCE(AVG(rating), 0) AS average_rating
	FROM Product_Ratings
	WHERE product_no = ${pid};
  `;
 

  //console.log(query); 
   
  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      //console.log(data); 
	  
  let rate_avg = document.querySelector(".product-rating-value");
  let rate_stars = document.querySelector(".product-rating-icons");
	  
      if(data.success){
	let res = data.results.recordset;
	res = res.length > 0 ? res[0].average_rating : null;

	if(res){
            rate_avg.innerHTML = res;
	    rate_avg.style.opacity = 1;
	    rate_stars.innerHTML = "";
	    for(var k= 0; k < 5; k++){
		if(k < parseInt(res))
		{
		    rate_stars.innerHTML += `<i class="fas fa-star"></i>`;
		}
	        else{
		    rate_stars.innerHTML += `<i class="far fa-star"></i>`;
	        }
	    }
	    rate_stars.style.opacity = 1;
	}
	else {
	   rate_avg.remove();	
	   rate_stars.remove();
	}
      } 
      else {
	rate_avg.remove();
	rate_stars.remove();
     }
  })
  .catch((error) => {
      console.error(error);
	  
      let rate_avg = document.querySelector(".product-rating-value");
      let rate_stars = document.querySelector(".product-rating-value");
	  
      rate_avg.remove();	
      rate_stars.remove();
  });
   // Read Rating : Own 
	
   let query = `
	SELECT rating
	FROM Product_Ratings
	WHERE product_no = ${pid};
  `;
 

  console.log(query); 
   
  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&own=true&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      console.log(data); 
  })
  .catch((error) => {
      console.error(error);
  });
	
   // Create Rating  
   document.getElementById('rating').addEventListener('change', function() {
      if (this.value) {
       // Your code here to handle the selected rating
        //console.log('Selected rating:', this.value);
	let queryr = `
	    IF NOT EXISTS ( SELECT 1 FROM Product_Ratings WHERE product_no = '${pid}' )
	      INSERT INTO Product_Ratings (product_no, rating )
	      VALUES ('${pid}', '${this.value}' )
	    ELSE
	      UPDATE Product_Ratings
	      SET rating = '${this.value}'
	      WHERE product_no = '${pid}'`;

	   //console.log(queryr);
	  // Send the form data to the server using fetch API
	  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(queryr)}`)
	  .then((response) => { 
	      return response.json();
	  })
	  .then((data) => {
	      //console.log(data); 
	    if(data.success){
	      flashMessage('Added Rating'); 
	    } 
	  })
	  .catch((error) => {
	      console.error(error);
	  }); 
      }
   });
   
   //
   query = `
        SELECT b.idx AS idx, b.product_name AS product_name, b.item_no AS item_no, b.main_dimension AS main_dimension, b.main_feature AS main_feature, b.price AS price, b.barcode AS barcode, b.quantity AS quantity, d9.idx AS category_no , d9.category_name AS category_name, d10.brand_name AS brand_name, b.availability AS availability
	FROM Products b, Categories d9, Brands d10
	WHERE b.category_no = d9.idx AND b.brand_no = d10.idx AND b.idx = ${pid}
   `;
   //console.log(query);
   fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
   .then((response) => response.json())
   .then((data) => { 
        //console.log(data);
        if(data.success){
           if(data.results.recordset.length > 0){
              var item = data.results.recordset[0];

              //console.log(item);
	      var categ = document.querySelector('.c_category'); 
	      categ.innerHTML = item.category_name;
	      categ.style.opacity = 1;

              var brand = document.querySelector('.product-manufacturer-link'); 
	      brand.innerHTML = item.brand_name;
	      brand.style.opacity = 1;

	      var dims = document.querySelector('.dims');
	      var is_dims = item.main_dimension && ['' , 'null'].indexOf(item.main_dimension) == -1;
              dims.innerHTML = `${is_dims ? `<span class="product-dimension">${item.main_dimension}</span> cm` : ''}`;
	      if(is_dims){ dims.style.opacity = 1; }
		   
              var feats = document.querySelector('.feats');
	      var is_feats = item.main_feature && ['' , 'null'].indexOf(item.main_feature) == -1;
	      feats.innerHTML = `${is_feats ? `<span class="product-feature">With</span> 
                          <span class="product-feature-detail">${item.main_feature}</span>`: ''}`;
	      if(is_feats){ feats.style.opacity = 1; }

              var img = document.querySelector('.product-image-container img');
              document.querySelectorAll('.c_product').forEach((name)=>{
                 name.innerHTML = item.product_name; 
                 name.style.opacity = 1;
              });

	      let query3 = 
	      `SELECT 
		  d.department_name AS department_name
		FROM 
		  Categories c
		  INNER JOIN Departments d ON c.department_no = d.idx
		WHERE 
		  c.idx = ${item.category_no};`;

	      var dept = document.querySelector('.c_department'); 
	      fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query3)}`)
               .then((response) => response.json())
               .then((data) => {
                  //console.log(data); 
		  if(data.success){
		      var res = data.results.recordset;
		      res = (res.length > 0) ? res[0] : null;

		       if(res){
			    dept.innerHTML = res.department_name;
			    dept.style.opacity = 1; 
		       }
		       else{
			 dept.remove();
		       }
		  }
		  else{
		     dept.remove();
		  }
               })
               .catch(error => {
		   console.error('Error:', error);
		   dept.remove();
		});

	      let query4 = `
		SELECT 
		  p.idx AS product_no, 
		  p.product_name, 
		  p.price AS original_price,
		  (p.price * ds.discount_amount / 100) AS discount_value,
		  (p.price - (p.price * ds.discount_amount / 100)) AS discounted_price,
		  ds.discount_name,
		  ds.discount_amount,
		  ds.end_date
		FROM 
		  Products p
		  LEFT JOIN Discount_Items di ON p.idx = di.product_no
		  LEFT JOIN Discounts ds ON di.discount_no = ds.idx
		WHERE 
		  p.idx = ${pid}
		  AND ds._status = 'Public';
		       `;
              var prc = document.querySelector('.product-price-container');
	      var prc_price = prc.querySelector('.product-price'); 
	      var prc_old_price = prc.querySelector('.product-old-price'); 
	      var prc_discount = prc.querySelector('.product-discount'); 
		   
	      fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query4)}`)
               .then((response) => response.json())
               .then((data) => {
                  //console.log(data); 
		  if(data.success){
		      var res = data.results.recordset;
		      res = (res.length > 0) ? res[0] : null;

		       if(res){ 
			 prc_price.innerHTML = addSpaces(res.discounted_price);
			 prc_old_price.innerHTML = addSpaces(res.original_price);
			 prc_discount.innerHTML = `<span class="product-discount-percentage">${res.discount_amount}</span>% Off`;
			 prc.style.opacity = 1;
		       }
		       else{
			 prc_price.innerHTML = addSpaces(item.price);
			 prc_old_price.remove();
			 prc_discount.remove();
			 prc.style.opacity = 1;
		       }
		  }
		  else{
		    prc_price.innerHTML = addSpaces(item.price);
		    prc_old_price.remove();
		    prc_discount.remove();
		    prc.style.opacity = 1;
		  }
               })
               .catch(error =>{ 
		  console.error('Error:', error);
		       
		  prc_price.innerHTML = addSpaces(item.price);
		  prc_oldprice.remove();
		  prc_discount.remove();
		  prc.style.opacity = 1;
		});

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
                            img.setAttribute("id","product-image"); 
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Products&idx=${encodeURI(item.idx)}`;
                            img.onload = function() {
                               //console.log('Image loaded');
                               img.style.opacity = 1; 
                            };
                         }		
                     
                         if(item.file_name && item.file_size && item.gallery == "YES"){
                            let gallery = new DOMParser().parseFromString(
                             `<div class="gallery-item">
                               <img src="" alt="" data-media-type="image">
                             </div>`, 
                             "text/html").body.firstChild;
                            
                            const img2 = gallery.querySelector("img");
                            img2.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Products&idx=${encodeURI(item.idx)}`;
                            img2.alt = item.product_name;
               
                            document.querySelector('#gallery-container2 .final').appendChild(gallery);
                             
                            
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
           }
        }
   })
   .catch((error) => {
       console.error(error);
   });
 
}
else{
 
}

/*-----*/ 
const galleryItems = document.querySelectorAll('.gallery-item');
const productQuantityInput = document.querySelector('.product-quantity-input input');
const productAddToCartButton = document.querySelector('.product-add-to-cart-button');
const infoContainers = document.querySelectorAll('.info-container');

const minusIcon = document.querySelector('.product-quantity-minus .fas');
const plusIcon = document.querySelector('.product-quantity-plus .fas');

const showMoreLink = document.querySelector('.product-description .show-more-link');
const hiddenParagraphs = document.querySelectorAll('.product-description .hidden');

galleryItems.forEach((item) => {
    item.addEventListener('click', () => { 
        galleryIt(item);
    });
});
observeLinkTags('gallery-item', 'click', (item)=>{
    galleryIt(item);
});

function galleryIt(item){
        let productImageContainer = document.querySelector('.product-image-container'); 
        let productImage = document.querySelector('#product-image');
	
        //console.log(item); 
	
        const mediaType = item.querySelector('img, video').getAttribute('data-media-type');
        const mediaSrc = item.querySelector('img, video').getAttribute('src');

	console.log(mediaType);
	console.log(mediaSrc);

        if (mediaType === 'image') {
            productImage.src = mediaSrc;
            productImageContainer.innerHTML = '';
            productImageContainer.appendChild(productImage);
        } else if (mediaType === 'video') {
            const videoElement = document.createElement('video');
            videoElement.src = mediaSrc;
            videoElement.controls = true;
            productImageContainer.innerHTML = '';
            productImageContainer.appendChild(videoElement);
        }
}

showMoreLink.addEventListener('click', (e) => {
    e.preventDefault();
    hiddenParagraphs.forEach((paragraph) => {
        paragraph.classList.toggle('hidden');
    });
    showMoreLink.textContent = showMoreLink.textContent === 'Show More' ? 'Show Less' : 'Show More';
});
// Add event listener to the minus icon
minusIcon.addEventListener('click', () => {
    // Decrement the product quantity input value
    const currentValue = parseInt(productQuantityInput.value);
    if (currentValue > 1) {
        productQuantityInput.value = currentValue - 1;
    }
});

// Add event listener to the plus icon
plusIcon.addEventListener('click', () => {
    // Increment the product quantity input value
    const currentValue = parseInt(productQuantityInput.value);
    productQuantityInput.value = currentValue + 1;
});

galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        // Get the image or video source of the clicked gallery item
        const mediaSource = item.querySelector('img, video').src;

        // Check if the media is an image or video
        if (item.querySelector('img')) {
            productImageContainer.innerHTML = '<img src="' + mediaSource + '">';
        } else if (item.querySelector('video')) {
            productImageContainer.innerHTML = '<video src="' + mediaSource + '" controls></video>';
        }
    });
});
// Add event listener to the product quantity input
productQuantityInput.addEventListener('input', () => {
    // Get the value of the product quantity input
    const quantity = parseInt(productQuantityInput.value);

    // Update the product price based on the quantity
    const price = parseFloat(document.querySelector('.product-price').textContent);
    const totalPrice = price * quantity;
    document.querySelector('.product-total-price').textContent = `R ${totalPrice.toFixed(2)}`;
});

// Add event listener to the product add to cart button
productAddToCartButton.addEventListener('click', () => {
    // Get the product name and price
    const productName = document.querySelector('.product-name').textContent;
    const productPrice = parseFloat(document.querySelector('.product-price').textContent);

    // Add the product to the cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, price: productPrice, quantity: parseInt(productQuantityInput.value) });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
});

// Add event listener to the info containers
infoContainers.forEach((container) => {
    container.querySelector('.info-toggle').addEventListener('click', () => {
        // Toggle the info content
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = infoContent.style.display === 'block' ? 'none' : 'block';

        // Toggle the chevron icon
        const chevronIcon = container.querySelector('.info-toggle .fas');
        chevronIcon.className = infoContent.style.display === 'block' ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    });
});

