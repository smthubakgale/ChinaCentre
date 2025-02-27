// Create an array to store registry items
let registryItems = [
  {
    name: "Living Room Set",
    type: "Furniture",
    date: "2025-02-20",
    gifts: [
      {
        name: "Sofa",
        price: 800.00,
        purchased: false
      },
      {
        name: "Loveseat",
        price: 600.00,
        purchased: false
      },
      {
        name: "Coffee Table",
        price: 200.00,
        purchased: false
      }
    ]
  },
  {
    name: "Dining Room Set",
    type: "Furniture",
    date: "2025-03-01",
    gifts: [
      {
        name: "Dining Table",
        price: 500.00,
        purchased: false
      },
      {
        name: "Chairs (Set of 4)",
        price: 400.00,
        purchased: false
      },
      {
        name: "Hutch",
        price: 300.00,
        purchased: false
      }
    ]
  },
  {
    name: "Bedroom Set",
    type: "Furniture",
    date: "2025-02-25",
    gifts: [
      {
        name: "Queen Size Bed",
        price: 1000.00,
        purchased: false
      },
      {
        name: "Dresser",
        price: 600.00,
        purchased: false
      },
      {
        name: "Nightstand",
        price: 200.00,
        purchased: false
      }
    ]
  }
];

// Get the registry table body
const registryTableBody = document.getElementById('registry-table-body');

// Function to display a registry item in the table
function displayRegistryItem(registryItem) {
  const tableRow = document.createElement('tr');
  tableRow.innerHTML = `
    <td>${registryItem.name}</td>
    <td>${registryItem.type}</td>
    <td>${registryItem.date}</td>
    <td>
      <button class="btn btn-primary">View Gifts</button>
    </td>
  `;
  registryTableBody.appendChild(tableRow);
}

// Display each registry item in the table
registryItems.forEach((registryItem) => {
  displayRegistryItem(registryItem);
});

// Add event listener to the registry table body
registryTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-primary')) {
    // Get the registry item to view
    const registryItemToView = registryItems.find((registryItem) => registryItem.name === e.target.parentNode.parentNode.cells[0].textContent);
    
    // Display the gifts for the selected registry item in a modal
    displayGiftsModal(registryItemToView);
  }
});

// Function to display the gifts for a registry item in a modal
function displayGiftsModal(registryItem) {
  // Get the modal
  const modal = document.getElementById('gift-modal');
  
  // Get the modal content
  const modalContent = document.getElementById('gift-modal-content');
  
  // Clear the modal content
  modalContent.innerHTML = '';
  
  // Create a header for the modal
  const modalHeader = document.createElement('h2');
  modalHeader.textContent = registryItem.name;
  modalContent.appendChild(modalHeader);
  
  // Create a list of gifts for the modal
  const giftList = document.createElement('ul');
  giftList.id = 'gift-list-modal';
  modalContent.appendChild(giftList);
  
  // Display each gift in the list
  registryItem.gifts.forEach((gift) => {
    const giftListItem = document.createElement('li');
    giftListItem.innerHTML = `
      <span>${gift.name}</span>
      <span>$${gift.price}</span>
      <button class="btn btn-danger">Remove</button>
    `;
    giftList.appendChild(giftListItem);
  });
  
  // Display the modal
  modal.style.display = 'block';
}

// Add event listener to the modal
document.getElementById('gift-modal').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-danger')) {
    // Get the gift to remove
    const giftToRemove = e.target.parentNode.cells[0].textContent;
    
    // Get the registry item
    const registryItem = registryItems.find((registryItem) => registryItem.gifts.find((gift) => gift.name === giftToRemove));
    
    // Remove the gift from the registry item's gifts array
    registryItem.gifts = registryItem.gifts.filter((gift) => gift.name !== giftToRemove);
    
    // Update the modal content
    displayGiftsModal(registryItem);
  }
});

// Add event listener to the modal close button
document.getElementById('gift-modal-close').addEventListener('click', () => {
  // Hide the modal
  document.getElementById('gift-modal').style.display = 'none';
});

// Add event listener to the create registry form
document.getElementById('create-registry-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get the form data
  const registryName = document.getElementById('registry-name').value;
  const registryType = document.getElementById('registry-type').value;
  const registryDate = document.getElementById('registry-date').value;
  
  // Create a new registry item
  const newRegistryItem = {
    name: registryName,
    type: registryType,
    date: registryDate,
    gifts: []
  };
  
  // Add the new registry item to the array
  registryItems.push(newRegistryItem);
  
  // Display the new registry item in the table
  displayRegistryItem(newRegistryItem);
  
  // Clear the form fields
  document.getElementById('registry-name').value = '';
  document.getElementById('registry-type').value = '';
  document.getElementById('registry-date').value = '';
});
