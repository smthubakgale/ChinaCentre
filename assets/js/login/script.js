// Get the login form
const loginForm = document.getElementById('login-form');

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
        alert('Please enter both email and password');
        return;
    }

    // Simulate a login request (replace with actual API call)
    console.log('Logging in with email:', email, 'and password:', password);

    // Redirect to dashboard page (replace with actual redirect)
    console.log('Redirecting to dashboard page');
});
