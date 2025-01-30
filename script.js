// Get the main content container
const mainContentContainer = document.getElementById('main-content');

// Define the routes for the pages
const routes = {
    'home': 'home.html',
    'about-us': 'about-us.html',
    'contact-us': 'contact-us.html',
    'products': 'products.html',
    'product-details': 'product-details.html',
    'product-comparison': 'product-comparison.html',
    'product-reviews': 'product-reviews.html',
    'categories': 'categories.html',
    'sub-category': 'sub-category.html',
    'account': 'account.html',
    'account-dashboard': 'account-dashboard.html',
    'order-history': 'order-history.html',
    'wish-list': 'wish-list.html',
    'address-book': 'address-book.html',
    'profile-settings': 'profile-settings.html',
    'order-confirmation': 'order-confirmation.html',
    'order-tracking': 'order-tracking.html',
    'payment-status': 'payment-status.html',
    'invoice': 'invoice.html',
    'help': 'help.html',
    'payment-methods': 'payment-methods.html',
    'shipping-information': 'shipping-information.html',
    'return-policy': 'return-policy.html',
    'warranty-information': 'warranty-information.html',
    'shipping-rates': 'shipping-rates.html',
    'delivery-schedule': 'delivery-schedule.html',
    'faq': 'faq.html',
    'blog': 'blog.html',
    'customer-support': 'customer-support.html',
    'sitemap': 'sitemap.html',
    'knowledge-base': 'knowledge-base.html',
    'glossary': 'glossary.html',
    'company': 'company.html',
    'testimonials': 'testimonials.html',
    'newsletter': 'newsletter.html',
    'affiliate-program': 'affiliate-program.html',
    'careers': 'careers.html',
    'press': 'press.html',
    'gift-registry': 'gift-registry.html',
    'store-locator': 'store-locator.html',
    'coupon-codes': 'coupon-codes.html',
    'loyalty-program': 'loyalty-program.html',
    'referral-program': 'referral-program.html',
    'community-forum': 'community-forum.html',
    'events-calendar': 'events-calendar.html',
    'webinars': 'webinars.html',
    'video-tutorials': 'video-tutorials.html',
};

// Function to load the main content dynamically
function loadMainContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            mainContentContainer.innerHTML = html;
        })
        .catch(error => console.error('Error loading main content:', error));
}

// Function to get the query parameter value
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load the page dynamically based on the query parameter
const page = getQueryParameter('page');
if (page && routes[page]) {
    loadMainContent(routes[page]);
} else {
    // Load the default page if no query parameter is provided
    loadMainContent('home.html');
}

// Function to check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Function to show/hide the sign in/sign up options
function updateAuthOptions() {
    const signInOptions = document.getElementById('sign-in-options');
    const logoutOption = document.getElementById('logout-option');
    if (isLoggedIn()) {
        signInOptions.style.display = 'none';
        logoutOption.style.display = 'block';
    } else {
        signInOptions.style.display = 'block';
        logoutOption.style.display = 'none';
    }
}

// Add event listener to the logout link
document.getElementById('logout-link').addEventListener('click', event => {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    updateAuthOptions();
});

// Update the auth options on page load
updateAuthOptions();

// Add event listener to the navigation menu
document.addEventListener('click', event => {
    if (event.target.tagName === 'A' && event.target.href) {
        event.preventDefault();
        const url = event.target.href;
        const page = url.split('?page=')[1];
        if (page && routes[page]) {
            loadMainContent(routes[page]);
        }
    }
});

// Function to login the user
function loginSuccessful() {
    localStorage.setItem('isLoggedIn', 'true');
    updateAuthOptions();
}

// Add event listener to the sign in link
document.getElementById('signin-link').addEventListener('click', event => {
    event.preventDefault();
    // Call the login function here
    loginSuccessful();
});
