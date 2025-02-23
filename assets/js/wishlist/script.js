// Function to remove wishlist item
function removeWishlistItem(event) {
    const removeButton = event.target;
    const wishlistItem = removeButton.closest('tr');
    wishlistItem.remove();
}

// Add event listeners for remove from wishlist buttons
document.querySelectorAll('.remove-from-wishlist').forEach((button) => {
    button.addEventListener('click', removeWishlistItem);
});

// Create a MutationObserver to monitor changes to the wishlist table
const wishlistTable = document.querySelector('.wishlist-table');
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Get the removed node (wishlist item)
            const removedNode = mutation.removedNodes[0];
            if (removedNode) {
                // Clone the removed node
                const clonedNode = removedNode.cloneNode(true);
                // Read attributes of the cloned node
                const productId = clonedNode.querySelector('button').dataset.productId;
                const productName = clonedNode.querySelector('td:first-child').textContent;
                console.log(`Removed product: ${productName} (ID: ${productId})`);
            }
        }
    });
});

// Configure the MutationObserver to observe the wishlist table
observer.observe(wishlistTable, {
    childList: true,
});
