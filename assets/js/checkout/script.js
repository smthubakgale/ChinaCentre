const addressOptions = document.querySelector('.address-options'); 
const addressDetails = document.querySelector('.address-details'); 
const changeButton = addressOptions.querySelector('.change-button');
const editButton = addressOptions.querySelector('.edit-button');
const deleteButton = addressOptions.querySelector('.delete-button');
const form = document.querySelector('form'); 
const continueButton = document.querySelector('.continue-button-container');

// Initially hide the form and the edit and delete buttons
form.style.display = 'none';
continueButton.style.display = 'none';
editButton.style.display = 'none';
deleteButton.style.display = 'none'; 
// 
changeButton.addEventListener('click', () => {
  //  
  changeButton.style.display = 'none'; 
  //  
  editButton.style.display = 'block';
  deleteButton.style.display = 'block'; 
 
  continueButton.style.display = 'block';
  // 
});

changeButton.addEventListener('click', () => {
  //
  addressDetails.style.display = 'none'; 
  continueButton.style.display = 'none';
  //
  form.style.display = 'block';
  // 
});
