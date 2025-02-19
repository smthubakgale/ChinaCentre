const addressOptions = document.querySelector('.address-options'); 
const addressDetails = document.querySelector('.address-details'); 
const changeButton = addressOptions.querySelector('.change-button');
const editButton = addressOptions.querySelector('.edit-button');
const deleteButton = addressOptions.querySelector('.delete-button');
const form = document.querySelector('form');

// Initially hide the form and the edit and delete buttons
form.style.display = 'none';
editButton.style.display = 'none';
deleteButton.style.display = 'none';

// Add an event listener to the change button
changeButton.addEventListener('click', () => {
  // Hide the change button
  changeButton.style.display = 'none';
  addressDetails.style.display = 'none';
  
  // Show the edit and delete buttons
  editButton.style.display = 'block';
  deleteButton.style.display = 'block';
  
  // Show the form
  form.style.display = 'block';
});

