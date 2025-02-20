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

// Function to handle filter form reset
function handleFilterFormReset() {
  document.getElementById("date-range").value = "";
  document.getElementById("payment-method").value = "";
  generatePaymentHistoryTableRows(paymentHistory);
}

// Function to handle payment history table row click
function handlePaymentHistoryTableRowClick(event) {
  const tableRow = event.target.parentNode;
  const paymentDate = tableRow.cells[0].textContent;
  const paymentMethod = tableRow.cells[1].textContent;
  const paymentAmount = tableRow.cells[2].textContent;
  const paymentStatus = tableRow.cells[3].textContent;
  
  // Display payment details in the modal window
  document.getElementById("payment-date").textContent = `Payment Date: ${paymentDate}`;
  document.getElementById("payment-method").textContent = `Payment Method: ${paymentMethod}`;
  document.getElementById("payment-amount").textContent = `Payment Amount: ${paymentAmount}`;
  document.getElementById("payment-status").textContent = `Payment Status: ${paymentStatus}`;
  
  // Show the modal window
  const modal = document.getElementById("payment-details-modal");
  modal.style.display = "block";
  
  // Add event listener to the close button
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = function() {
    modal.style.display = "none";
  };
  
  // Add event listener to the modal window
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Generate payment history table rows on page load
generatePaymentHistoryTableRows(paymentHistory);

// Add event listener to filter form submission
document.getElementById("filter-form").addEventListener("submit", handleFilterFormSubmission);

// Add event listener to filter form reset
document.getElementById("filter-form-reset").addEventListener("click", handleFilterFormReset);

// Add event listener to payment history table rows
const paymentHistoryTableRows = document.getElementById("payment-history-table-body").rows;
for (let i = 0; i < paymentHistoryTableRows.length; i++) {
  paymentHistoryTableRows[i].addEventListener("click", handlePaymentHistoryTableRowClick);
}

// Function to handle modal window close
function handleModalWindowClose() {
  const modal = document.getElementById("payment-details-modal");
  modal.style.display = "none";
}

// Add event listener to modal window close button
const closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", handleModalWindowClose);

// Function to handle window click
function handleWindowClick(event) {
  const modal = document.getElementById("payment-details-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Add event listener to window
window.addEventListener("click", handleWindowClick);


