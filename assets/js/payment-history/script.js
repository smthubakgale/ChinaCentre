// Sample payment data
const paymentData = {
    currentStatus: 'Paid',
    paymentHistory: [
        {
            id: 1,
            date: '2022-01-01',
            amount: '100.00',
            status: 'Paid'
        },
        {
            id: 2,
            date: '2022-02-01',
            amount: '50.00',
            status: 'Pending'
        },
        {
            id: 3,
            date: '2022-03-01',
            amount: '200.00',
            status: 'Paid'
        },
        {
            id: 4,
            date: '2022-04-01',
            amount: '75.00',
            status: 'Failed'
        },
        {
            id: 5,
            date: '2022-05-01',
            amount: '150.00',
            status: 'Paid'
        }
    ]
};

//const currentPaymentStatusElement = document.getElementById('current-payment-status');
const paymentHistoryBodyElement = document.getElementById('payment-history-body');
const statusFilterElement = document.getElementById('status-filter');
const dateFilterElement = document.getElementById('date-filter');
const sortOrderElement = document.getElementById('sort-order');

// Update current payment status
//currentPaymentStatusElement.textContent = paymentData.currentStatus;

// Populate payment history table
function populatePaymentHistoryTable() {
    paymentHistoryBodyElement.innerHTML = '';
    const filteredPayments = filterPayments(paymentData.paymentHistory);
    const sortedPayments = sortPayments(filteredPayments);
    sortedPayments.forEach((payment) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.date}</td>
            <td>R ${payment.amount}</td>
            <td>${payment.status}</td>
            <td><button class="request-invoice-button" data-payment-id="${payment.id}">Request Invoice</button></td>
        `;
        paymentHistoryBodyElement.appendChild(row);
    });
}

// Filter payments based on status and date
function filterPayments(payments) {
    const statusFilter = statusFilterElement.value;
    const dateFilter = dateFilterElement.value;
    return payments.filter((payment) => {
        if (statusFilter && payment.status !== statusFilter) {
            return false;
        }
        if (dateFilter === 'Today' && !isToday(payment.date)) {
            return false;
        }
        if (dateFilter === 'This Week' && !isThisWeek(payment.date)) {
            return false;
        }
        if (dateFilter === 'This Month' && !isThisMonth(payment.date)) {
            return false;
        }
        return true;
    });
}

// Sort payments based on sort order
function sortPayments(payments) {
    const sortOrder = sortOrderElement.value;
    if (sortOrder === 'date-desc') {
        return payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'date-asc') {
        return payments.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'amount-desc') {
        return payments.sort((a, b) => parseFloat(b.amount.replace('$', '')) - parseFloat(a.amount.replace('$', '')));
    } else if (sortOrder === 'amount-asc') {
        return payments.sort((a, b) => parseFloat(a.amount.replace('$', '')) - parseFloat(b.amount.replace('$', '')));
    }
    return payments;
}

// Helper functions
function isToday(date) {
    const today = new Date();
    return date === today.toISOString().split('T')[0];
}

function isThisWeek(date) {
    const today = new Date();
    const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const thisWeekEnd = new Date(today.setDate(today.getDate() + (6 - today.getDay())));
    return date >= thisWeekStart.toISOString().split('T')[0] && date <= thisWeekEnd.toISOString().split('T')[0];
}

function isThisMonth(date) {
    const today = new Date();
    return date.substring(0, 7) === today.toISOString().split('T')[0].substring(0, 7);
}

// Add event listeners
statusFilterElement.addEventListener('change', populatePaymentHistoryTable);
dateFilterElement.addEventListener('change', populatePaymentHistoryTable);
sortOrderElement.addEventListener('change', populatePaymentHistoryTable);

// Initialize payment history table
populatePaymentHistoryTable();

// Add event listener for request invoice buttons
document.querySelectorAll('.request-invoice-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const paymentId = e.target.getAttribute('data-payment-id');
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', 'invoice');
        urlParams.set('fill', 'top');
        urlParams.set('payment-id', paymentId);
        window.location.search = urlParams.toString();
    });
});
//

