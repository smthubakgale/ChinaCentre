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
