const filterBtn = document.querySelector('.filter-btn');
const filterAside = document.querySelector('.filter-aside');
const closeButton = document.querySelector('.filter-close');

const sortContainer = document.querySelector('.sort-container');
const sortOptions = document.querySelector('.sort-options');
const chevronIcon = document.querySelector('.chevron-icon i');

const showMoreBtn = document.querySelector('.show-more-btn');
const additionalColorOptions = document.querySelector('.additional-color-options');
const showLessBtn = document.querySelector('.show-less-btn');

// Pop Up 
filterBtn.addEventListener('click', () => {
  filterAside.classList.toggle("pop-show");
});

closeButton.addEventListener('click', () => {
  filterAside.classList.remove("pop-show");
});

// Aside Sort 
sortContainer.addEventListener('click', () => {
  if (sortOptions.style.display === 'none') {
    sortOptions.style.display = 'block';
    chevronIcon.className = 'fas fa-chevron-up';
  } else {
    sortOptions.style.display = 'none';
    chevronIcon.className = 'fas fa-chevron-down';
  }
});

// Aside : Show More 
showMoreBtn.addEventListener('click', () => {
    additionalColorOptions.style.display = 'block';
    showMoreBtn.style.display = 'none';
    showLessBtn.style.display = 'block';
});

showLessBtn.addEventListener('click', () => {
    additionalColorOptions.style.display = 'none';
    showMoreBtn.style.display = 'block';
    showLessBtn.style.display = 'none';
});











