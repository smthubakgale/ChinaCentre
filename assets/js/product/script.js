const galleryItems = document.querySelectorAll('.gallery-item');
const productImageContainer = document.querySelector('.product-image-container');
const productQuantityInput = document.querySelector('.product-quantity-input input');
const productAddToCartButton = document.querySelector('.product-add-to-cart-button');
const infoContainers = document.querySelectorAll('.info-container');

const minusIcon = document.querySelector('.product-quantity-minus .fas');
const plusIcon = document.querySelector('.product-quantity-plus .fas');

const showMoreLink = document.querySelector('.product-description .show-more');
const hiddenParagraphs = document.querySelectorAll('.product-description .hidden');

/* 
showMoreLink.addEventListener('click', () => {
    hiddenParagraphs.forEach((paragraph) => {
        paragraph.classList.toggle('hidden');
    });
    showMoreLink.textContent = showMoreLink.textContent === 'Show More' ? 'Show Less' : 'Show More';
});
*/
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

// Add event listener to the gallery items
galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        // Get the image source of the clicked gallery item
        const imageSource = item.querySelector('img').src;

        // Set the image source of the product image container
        productImageContainer.querySelector('img').src = imageSource;
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
