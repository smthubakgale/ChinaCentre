// Get the login form
const loginForm = document.getElementById('login-form'); 
const loginMessageDiv = document.getElementById('login-message');
var api_url = d_config.url;

// Function to handle login
function handleLogin(email, password) {
  // Simulate a login request (replace with actual API call)
  fetch(api_url + `login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Login successful, create a session using localStorage
        localStorage.setItem('chinacentre', JSON.stringify(data.session));
        // Redirect to dashboard page
        loadPage('dashboard');
      } else {
        loginMessageDiv.innerHTML = 'Invalid email or password';
        loginMessageDiv.style.color = 'red';
      }
    })
    .catch((error) => {
      loginMessageDiv.innerHTML = 'Error logging in';
      loginMessageDiv.style.color = 'red';
    });
}

// Add an event listener to the login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the email and password input fields
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Get the email and password values
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate the email and password
  if (email === '' || password === '') {
    loginMessageDiv.innerHTML = 'Please enter both email and password';
    loginMessageDiv.style.color = 'red';
    return;
  }

  // Call the handleLogin function
  handleLogin(email, password);
});
