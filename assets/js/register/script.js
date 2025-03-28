// script.js
// Get the register form
const registerForm = document.getElementById('register-form');
const registerMessageDiv = document.getElementById('register-message');
var api_url = d_config.url;

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
  const url = api_url + `register?firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {

      if(data.message == 'User Already Exists'){ 
          registerMessageDiv.innerHTML = data.message;
          registerMessageDiv.style.color = 'red';
      }
      else
      {
        registerMessageDiv.innerHTML = data.message;
        registerMessageDiv.style.color = 'green';
  
        setTimeout(function()
        {
             fetch(api_url + `login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // Login successful, create a session using localStorage
                localStorage.setItem('chinacentre', JSON.stringify(data.session));
                localStorage.removeItem('chinacentre_local');
                // Redirect to dashboard page
                fill = "none";
                loadPage('dashboard'); 
                renderFill("none");
                // 
              } else {
                registerMessageDiv.innerHTML = data.message;
                registerMessageDiv.style.color = 'red';
              }
            })
            .catch((error) => 
            {
              // Redirect to dashboard page
                 loadPage('login');
              //
            });
              
        },10);
      }
    })
    .catch((error) => {
      console.log(error);
      
      registerMessageDiv.innerHTML = 'Error registering user'; 
      registerMessageDiv.style.color = 'red';
    });
});
