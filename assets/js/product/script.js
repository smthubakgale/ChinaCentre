let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');

console.log(urs);

let Params = getQueryParams(urs);
let pid = Params['product'];

console.log(Params , pid); 

if(pid){
   let query = `
        SELECT b.idx AS idx, b.product_name AS product_name, b.item_no AS item_no, b.main_dimension AS main_dimension, b.main_feature AS main_feature, b.price AS price, b.barcode AS barcode, b.quantity AS quantity, d9.category_name AS category_no, d10.brand_name AS brand_no, b.availability AS availability
	FROM Products b, Categories d9, Brands d10
	WHERE b.category_no = d9.idx AND b.brand_no = d10.idx AND b.idx = ${pid}
   `;
   console.log(query);
   fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
   .then((response) => response.json())
   .then((data) => { 
        console.log(data);
        if(data.success){
           if(data.results.recordset.length > 0){
              var item = data.results.recordset[0];

              console.log(item);
	      var categ = document.querySelector('.c_category');
		   
	      categ.innerHTML = item.category_name;
	      categ.style.opacity = 1;

              document.querySelector('.dims').innerHTML = `${item.main_dimension && ['' , 'null'].indexOf(item.main_dimension) == -1 ? `<span class="product-dimension">${item.main_dimension}</span> cm` : ''}`;
              document.querySelector('.feats').innerHTML = `${item.main_feature && ['' , 'null'].indexOf(item.main_feature) == -1 ? 
			                `<span class="product-feature">With</span> 
                          <span class="product-feature-detail">${item.main_feature}</span>`: ''}`;

              var img = document.querySelector('.product-image-container img');
              document.querySelectorAll('.c_product').forEach((name)=>{
                 name.innerHTML = item.product_name; 
                 name.style.opacity = 1;
              });

              let query2 = `SELECT Category_name
               FROM Categories
               WHERE idx = ${item.category_no}
              `;

              
               fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query2)}`)
               .then((response) => response.json())
               .then((data) => {
                  console.log(data); 
               })
               .catch(error => console.error('Error:', error));
 
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
                            img.onload = function() {
                               console.log('Image loaded');
                               img.style.opacity = 1; 
                            };
                         }		
                     
                         if(item.file_name && item.file_size && item.gallery == "YES"){
                            let gallery = new DOMParser().parseFromString(
                             `<div class="gallery-item">
                               <img src="" alt="">
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
const productImageContainer = document.querySelector('.product-image-container');
const productQuantityInput = document.querySelector('.product-quantity-input input');
const productAddToCartButton = document.querySelector('.product-add-to-cart-button');
const infoContainers = document.querySelectorAll('.info-container');

const minusIcon = document.querySelector('.product-quantity-minus .fas');
const plusIcon = document.querySelector('.product-quantity-plus .fas');

const showMoreLink = document.querySelector('.product-description .show-more-link');
const hiddenParagraphs = document.querySelectorAll('.product-description .hidden');
 
const productImage = document.querySelector('#product-image');

galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        const mediaType = item.querySelector('img, video').getAttribute('data-media-type');
        const mediaSrc = item.querySelector('img, video').getAttribute('src');

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
    });
});

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
