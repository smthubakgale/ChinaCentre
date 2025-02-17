const cartPageElement = document.querySelector('.cart-page');

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
