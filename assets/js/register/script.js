// Get the register form
const registerForm = document.getElementById('register-form');

// Add an event listener to the register form
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the name, email, password, and confirm password input fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Get the name, email, password, and confirm password values
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate the name, email, password, and confirm password
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill out all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Simulate a register request (replace with actual API call)
    console.log('Registering with name:', name, 'email:', email, 'and password:', password);

    // Redirect to login page (replace with actual redirect)
    console.log('Redirecting to login page');
});
