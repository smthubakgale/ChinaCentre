const filterBtn = document.querySelector('.filter-btn');
const filterAside = document.querySelector('.filter-aside');
const closeButton = document.querySelector('.filter-close');

filterBtn.addEventListener('click', () => {
  filterAside.classList.toggle("pop-show");
});

closeButton.addEventListener('click', () => {
  filterAside.classList.remove("pop-show");
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

// Add event listener to pagination numbers
document.querySelectorAll('.pagination-number').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all pagination numbers
        document.querySelectorAll('.pagination-number').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to the clicked pagination number
        button.classList.add('active');
        // Display the corresponding page of product items
        displayProductItems(button.textContent);
    });
});

// Add event listener to previous button
document.querySelector('.previous-button').addEventListener('click', () => {
    const activePaginationNumber = document.querySelector('.pagination-number.active');
    const previousPaginationNumber = activePaginationNumber.previousElementSibling;
    if (previousPaginationNumber) {
        previousPaginationNumber.click();
    }
});

// Add event listener to next button
document.querySelector('.next-button').addEventListener('click', () => {
    const activePaginationNumber = document.querySelector('.pagination-number.active');
    const nextPaginationNumber = activePaginationNumber.nextElementSibling;
    if (nextPaginationNumber) {
        nextPaginationNumber.click();
    }
});

// Function to display product items based on the page number
function displayProductItems(pageNumber) {
    const productContainer = document.querySelector('.product-container');
    // Clear the product container
    productContainer.innerHTML = '';
    // Display the product items for the corresponding page number
    for (let i = (pageNumber - 1) * 10; i < pageNumber * 10; i++) {
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

// Call the function to display product items for the first page
displayProductItems(1);

// Function to handle pagination
function handlePagination() {
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const previousButton = document.querySelector('.previous-button');
    const nextButton = document.querySelector('.next-button');
    const currentPage = document.querySelector('.pagination-number.active').textContent;
    const totalPages = paginationNumbers.length;
    
    // Disable previous button if current page is 1
    if (currentPage === '1') {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }
    
    // Disable next button if current page is the last page
    if (currentPage === totalPages.toString()) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

// Call the function to handle pagination
handlePagination();





