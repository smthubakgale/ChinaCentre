// Get the profile image input and upload button
const profileImageInput = document.getElementById('profile-image-input');
const uploadProfileImageBtn = document.getElementById('upload-profile-image-btn');

// Add an event listener to the upload button
uploadProfileImageBtn.addEventListener('click', () => {
  // Simulate a click on the profile image input
  profileImageInput.click();
});

// Add an event listener to the profile image input
profileImageInput.addEventListener('change', (e) => {
  // Get the selected file
  const file = e.target.files[0];

  // Create a new FileReader instance
  const fileReader = new FileReader();

  // Add an event listener to the FileReader instance
  fileReader.addEventListener('load', () => {
    // Get the profile image element
    const profileImage = document.getElementById('profile-image');

    // Set the src attribute of the profile image element to the uploaded image
    profileImage.src = fileReader.result;
  });

  // Read the selected file as a data URL
  fileReader.readAsDataURL(file);
});

// Get the form element
const form = document.querySelector('form');

// Add an event listener to the form element
form.addEventListener('submit', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the form data
  const formData = new FormData(form);

  // Send the form data to the server using fetch
  fetch('/api/profile', {
    method: 'POST',
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
});
