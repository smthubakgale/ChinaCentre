// Sample payment history data
const paymentHistory = [
  {
    date: "2022-01-01",
    paymentMethod: "Credit Card",
    amount: 100.00,
    status: "Success"
  },
  {
    date: "2022-01-15",
    paymentMethod: "Bank Transfer",
    amount: 200.00,
    status: "Pending"
  },
  {
    date: "2022-02-01",
    paymentMethod: "Credit Card",
    amount: 50.00,
    status: "Failed"
  }
];

// Function to generate payment history table rows
function generatePaymentHistoryTableRows(paymentHistory) {
  const tableBody = document.getElementById("payment-history-table-body");
  tableBody.innerHTML = "";
  
  paymentHistory.forEach((payment) => {
    const tableRow = document.createElement("tr");
    const dateCell = document.createElement("td");
    const paymentMethodCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const statusCell = document.createElement("td");
    
    dateCell.textContent = payment.date;
    paymentMethodCell.textContent = payment.paymentMethod;
    amountCell.textContent = payment.amount;
    statusCell.textContent = payment.status;
    
    tableRow.appendChild(dateCell);
    tableRow.appendChild(paymentMethodCell);
    tableRow.appendChild(amountCell);
    tableRow.appendChild(statusCell);
    
    tableBody.appendChild(tableRow);
  });
}

// Function to handle filter form submission
function handleFilterFormSubmission(event) {
  event.preventDefault();
  const dateRange = document.getElementById("date-range").value;
  const paymentMethod = document.getElementById("payment-method").value;
  
  const filteredPaymentHistory = paymentHistory.filter((payment) => {
    return (dateRange === "" || payment.date === dateRange) && (paymentMethod === "" || payment.paymentMethod === paymentMethod);
  });
  
  generatePaymentHistoryTableRows(filteredPaymentHistory);
}

// Generate payment history table rows on page load
generatePaymentHistoryTableRows(paymentHistory);

// Add event listener to filter form submission
document.getElementById("filter-form").addEventListener("submit", handleFilterFormSubmission);

// Function to handle filter form reset
function handleFilterFormReset() {
  document.getElementById("date-range").value = "";
  document.getElementById("payment-method").value = "";
  generatePaymentHistoryTableRows(paymentHistory);
}

// Add event listener to filter form reset
document.getElementById("filter-form-reset").addEventListener("click", handleFilterFormReset);

// Function to handle payment history table row click
function handlePaymentHistoryTableRowClick(event) {
  const tableRow = event.target.parentNode;
  const paymentDate = tableRow.cells[0].textContent;
  const paymentMethod = tableRow.cells[1].textContent;
  const paymentAmount = tableRow.cells[2].textContent;
  const paymentStatus = tableRow.cells[3].textContent;
  
  // Display payment details in a modal window or alert box
  alert(`Payment Date: ${paymentDate}\nPayment Method: ${paymentMethod}\nPayment Amount: ${paymentAmount}\nPayment Status: ${paymentStatus}`);
}

// Add event listener to payment history table rows
const paymentHistoryTableRows = document.getElementById("payment-history-table-body").rows;
for (let i = 0; i < paymentHistoryTableRows.length; i++) {
  paymentHistoryTableRows[i].addEventListener("click", handlePaymentHistoryTableRowClick);
}
