// script.js
// Get the register form
const registerForm = document.getElementById('register-form');
const registerMessageDiv = document.getElementById('register-message');
var api_url = d_config.url;

console.log(api_url);

// Add an event listener to the register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the name, email, password, and confirm password input fields
  const firstnameInput = document.getElementById('firstname');
  const lastnameInput = document.getElementById('lastname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Get the name, email, password, and confirm password values
  const firstname = firstnameInput.value;
  const lastname = lastnameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validate the name, email, password, and confirm password
  if (firstname === '' || lastname === '' || email === '' || password === '' || confirmPassword === '') {
    registerMessageDiv.innerHTML = 'Please fill out all fields';
    registerMessageDiv.style.color = 'red';
    return;
  }

  if (password !== confirmPassword) {
    registerMessageDiv.innerHTML = 'Passwords do not match';
    registerMessageDiv.style.color = 'red';
    return;
  }

  // Send a GET request to the /register endpoint
  const url = api_url + `register?firstname=${firstname}&lastname=${lastname}&email=${email}&password=${password}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      registerMessageDiv.innerHTML = data.message;
      registerMessageDiv.style.color = 'green';

      setTimeout(function()
        {
           // Redirect to dashboard page
           loadPage('dashboard');
           // 
        },800);
    })
    .catch((error) => {
      registerMessageDiv.innerHTML = 'Error registering user';
      registerMessageDiv.style.color = 'red';
    });
});
