// Get all filter checkboxes
const filterCheckboxes = document.querySelectorAll('.filter-aside input[type="checkbox"]');

// Get all filter buttons
const filterButtons = document.querySelectorAll('.filter-btn-container button');

// Get all product items
const productItems = document.querySelectorAll('.product-item');

// Add event listener to filter checkboxes
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterProducts);
});

// Add event listener to filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', button => {
    if (button.target.classList.contains('apply-filter-btn')) {
      applyFilters();
    } else if (button.target.classList.contains('clear-filter-btn')) {
      clearFilters();
    }
  });
});

// Filter products based on checkbox values
function filterProducts() {
  const selectedFilters = [];
  filterCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedFilters.push(checkbox.id);
    }
  });

  productItems.forEach(product => {
    const productFilters = product.dataset.filters.split(',');
    const matchesFilter = selectedFilters.every(filter => productFilters.includes(filter));

    if (matchesFilter) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Apply filters based on checkbox values
function applyFilters() {
  filterProducts();
}

// Clear filters and show all products
function clearFilters() {
  filterCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  productItems.forEach(product => {
    product.style.display = 'block';
  });
}

// Initialize pagination
const paginationNumbers = document.querySelectorAll('.pagination-numbers span');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');

let currentPage = 1;

paginationNumbers.forEach((number, index) => {
  number.addEventListener('click', () => {
    currentPage = index + 1;
    updatePagination();
  });
});

prevButton.addEventListener('click', () => {
  currentPage--;
  updatePagination();
});

nextButton.addEventListener('click', () => {
  currentPage++;
  updatePagination();
});

function updatePagination() {
  paginationNumbers.forEach((number, index) => {
    if (index + 1 === currentPage) {
      number.classList.add('active');
    } else {
      number.classList.remove('active');
    }
  });

  // Update product items based on current page
  const productsPerPage = 12;
  const startProduct = (currentPage - 1) * productsPerPage;
  const endProduct = startProduct + productsPerPage;

  productItems.forEach((product, index) => {
    if (index >= startProduct && index < endProduct) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Update pagination numbers based on total products
function updatePaginationNumbers() {
  const totalProducts = productItems.length;
  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  paginationNumbers.forEach((number, index) => {
    if (index < totalPages) {
      number.style.display = 'inline-block';
    } else {
      number.style.display = 'none';
    }
  });
}

// Call updatePaginationNumbers function
updatePaginationNumbers();

// Add event listener to product items
productItems.forEach(product => {
  product.addEventListener('click', () => {
    // Get product details
    const productDetails = product.dataset.details;

    // Display product details
    const productDetailModal = document.querySelector('.product-detail-modal');
    productDetailModal.style.display = 'block';
    productDetailModal.innerHTML = productDetails;
  });
});

// Add event listener to close product detail modal
const closeProductDetailModal = document.querySelector('.close-product-detail-modal');
closeProductDetailModal.addEventListener('click', () => {
  const productDetailModal = document.querySelector('.product-detail-modal');
  productDetailModal.style.display = 'none';
});

