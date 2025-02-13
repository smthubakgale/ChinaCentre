// Add event listener to filter buttons
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        console.log('Filter button clicked');
        // Add filter logic here
    });
});

// Add event listener to mobile filter popup
document.querySelector('.mobile-filter-popup').addEventListener('click', () => {
    document.querySelector('.mobile-filter-popup').style.display = 'none';
});

// Add event listener to sort select
document.querySelector('#sort-select').addEventListener('change', () => {
    console.log('Sort select changed');
    // Add sort logic here
});

// Function to display product items
function displayProductItems() {
    const productContainer = document.querySelector('.product-container');
    // Add product items to the container
    for (let i = 0; i < 10; i++) {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="product-image.jpg" alt="Product Image">
            <h4>Product Name</h4>
            <p>Price: R 1000</p>
        `;
        productContainer.appendChild(productItem);
    }
}

// Call the function to display product items
displayProductItems();

// Function to display mobile filter popup
function displayMobileFilterPopup() {
    const mobileFilterPopup = document.querySelector('.mobile-filter-popup');
    mobileFilterPopup.style.display = 'block';
}

// Add event listener to filter aside
document.querySelector('.filter-aside').addEventListener('click', () => {
    displayMobileFilterPopup();
});

