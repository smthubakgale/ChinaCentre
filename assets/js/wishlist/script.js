// Function to remove wishlist item
// Function to remove wishlist item
function removeWishlistItem(event) {
    const removeButton = event.target;
    const wishlistItem = removeButton.closest('tr');
    const productName = wishlistItem.querySelector('td:first-child').textContent;
    console.log(`Removed product: ${productName}`);
    wishlistItem.remove();
}

// Add event listeners for remove from wishlist buttons
document.querySelectorAll('.remove-from-wishlist').forEach((button) => {
    button.addEventListener('click', removeWishlistItem);
});
