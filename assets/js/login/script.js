var login = {
  init: () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username && password) {
        // Here you can add your authentication logic
        console.log(`Username: ${username}, Password: ${password}`);
        alert('Login successful!');
      } else {
        alert('Please enter both username and password.');
      }
    });
  }
};

// Initialize the page
login.init();
