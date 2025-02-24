// Get the profile settings container
const profileSettingsContainer = document.querySelector('.profile-settings-container');

// Get the edit button
const editButton = document.querySelector('.edit-button');

// Get the profile form
const profileForm = document.querySelector('.profile-form');

// Get the profile information
const profileInformation = document.querySelector('.profile-information');

// Add an event listener to the edit button
editButton.addEventListener('click', () => {
  // Toggle the display of the profile form and profile information
  profileForm.style.display = profileForm.style.display === 'block' ? 'none' : 'block';
  profileInformation.style.display = profileInformation.style.display === 'block' ? 'none' : 'block';
});

// Add an event listener to the profile form submit button
profileForm.addEventListener('submit', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the form data
  const formData = new FormData(profileForm);

  // Get the form fields
  const firstName = formData.get('first-name');
  const lastName = formData.get('last-name');
  const email = formData.get('email');
  const phone = formData.get('phone');

  // Update the profile information
  document.querySelector('.info-value:first-child').textContent = firstName;
  document.querySelector('.info-value:nth-child(2)').textContent = lastName;
  document.querySelector('.info-value:nth-child(3)').textContent = email;
  document.querySelector('.info-value:nth-child(4)').textContent = phone;

  // Toggle the display of the profile form and profile information
  profileForm.style.display = 'none';
  profileInformation.style.display = 'block';
});
