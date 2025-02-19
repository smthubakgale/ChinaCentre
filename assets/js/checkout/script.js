const shippingInfo = document.querySelector('.shipping-info'); 
const addressOptions = document.querySelector('.address-options'); 
const addressDetails = document.querySelector('.address-details'); 
const changeButton = addressOptions.querySelector('.change-button');
const editButton = addressOptions.querySelector('.edit-button');
const deleteButton = addressOptions.querySelector('.delete-button');
const form = document.querySelector('form'); 
const continueButton = document.querySelector('.continue-button-container');

// 
changeButton.addEventListener('click', () => {
  shippingInfo.classList.remove("edit-change");
  shippingInfo.classList.add("address-change");
});

editButton.addEventListener('click', () => {
  shippingInfo.classList.remove("address-change");
  shippingInfo.classList.add("edit-change");
});
