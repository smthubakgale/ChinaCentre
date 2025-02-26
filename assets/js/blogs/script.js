// Get all read more buttons
const readMoreButtons = document.querySelectorAll('.read-more');

// Add event listener to each button
readMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the additional content element
    const additionalContent = button.nextElementSibling;
    
    // Toggle the display of the additional content
    additionalContent.style.display = additionalContent.style.display === 'block' ? 'none' : 'block';
    
    // Toggle the text of the read more button
    button.textContent = additionalContent.style.display === 'block' ? 'Read Less' : 'Read More';
  });
});
