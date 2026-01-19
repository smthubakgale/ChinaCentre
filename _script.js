document.addEventListener('DOMContentLoaded', function() {
    // Add subtle animation to the payment button
    const payButton = document.querySelector('button.bg-red-600');
    if (payButton) {
        payButton.addEventListener('mouseenter', () => {
            payButton.classList.add('animate-pulse-slow');
        });
        
        payButton.addEventListener('mouseleave', () => {
            payButton.classList.remove('animate-pulse-slow');
        });
    }

    // Simulate a countup effect for the overdue days
    const overdueDaysElement = document.querySelector('.text-4xl.font-bold.text-gray-800');
    if (overdueDaysElement) {
        let current = 0;
        const target = parseInt(overdueDaysElement.textContent);
        const increment = target / 20;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                overdueDaysElement.textContent = target;
            } else {
                overdueDaysElement.textContent = Math.floor(current);
            }
        }, 50);
    }
});
