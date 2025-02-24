// Get the edit button
const editButton = document.querySelector('.edit-button');

// Get the profile form
const profileForm = document.querySelector('.profile-form');

// Get the profile information
const profileInformation = document.querySelector('.profile-information');

// Get the form fields
const firstNameField = document.querySelector('#first-name');
const lastNameField = document.querySelector('#last-name');
const emailField = document.querySelector('#email');
const phoneField = document.querySelector('#phone');

// Get the profile information fields
const firstNameInfo = document.querySelector('.info-value:first-child');
const lastNameInfo = document.querySelector('.info-value:nth-child(2)');
const emailInfo = document.querySelector('.info-value:nth-child(3)');
const phoneInfo = document.querySelector('.info-value:nth-child(4)');

// Add an event listener to the edit button
editButton.addEventListener('click', () => {
  // Toggle the display of the profile form and profile information
  profileForm.style.display = profileForm.style.display === 'block' ? 'none' : 'block';
  profileInformation.style.display = profileInformation.style.display === 'block' ? 'none' : 'block';
});

// Add an event listener to the form submit button
profileForm.querySelector('form').addEventListener('submit', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Update the profile information
  firstNameInfo.textContent = firstNameField.value;
  lastNameInfo.textContent = lastNameField.value;
  emailInfo.textContent = emailField.value;
  phoneInfo.textContent = phoneField.value;

  // Toggle the display of the profile form and profile information
  profileForm.style.display = 'none';
  profileInformation.style.display = 'block';
});
