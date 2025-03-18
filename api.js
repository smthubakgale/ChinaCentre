const navLinks = document.querySelectorAll('.nav-link');

const hrefs = Array.from(navLinks).map(link => link.getAttribute('href').replace('#', ''));

const jsonData = JSON.stringify(hrefs);

console.log(jsonData);

