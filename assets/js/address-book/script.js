// Get the modal
var modal = document.getElementById("add-address-modal");

// Get the button that opens the modal
var btn = document.getElementById("add-address-btn");

// Get the button that saves the address
var saveAddressBtn = document.getElementById("save-address-btn");

// Get the button that cancels the address addition
var cancelBtn = document.getElementById("cancel-btn");

// Get the form fields
var nameField = document.getElementById("name");
var streetField = document.getElementById("street");
var cityField = document.getElementById("city");
var stateField = document.getElementById("state");
var zipField = document.getElementById("zip");
var addressTypeField = document.getElementById("address-type");

// Function to open the modal
function openModal() {
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Add event listener to the button that opens the modal
btn.addEventListener("click", openModal);

// Add event listener to the button that saves the address
saveAddressBtn.addEventListener("click", saveAddress);

// Add event listener to the button that cancels the address addition
cancelBtn.addEventListener("click", closeModal);

// Function to save the address
function saveAddress() {
  // Get the address type
  var addressType = addressTypeField.value;

  // Get the address details
  var name = nameField.value;
  var street = streetField.value;
  var city = cityField.value;
  var state = stateField.value;
  var zip = zipField.value;

  // Create a new address item
  var addressItem = document.createElement("div");
  addressItem.classList.add("address-item");

  // Create the address checkbox
  var addressCheckbox = document.createElement("div");
  addressCheckbox.classList.add("address-checkbox");
  var checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  addressCheckbox.appendChild(checkboxInput);
  addressItem.appendChild(addressCheckbox);

  // Create the address details
  var addressDetails = document.createElement("div");
  addressDetails.classList.add("address-details");
  var addressName = document.createElement("div");
  addressName.classList.add("address-name");
  addressName.textContent = name;
  addressDetails.appendChild(addressName);
  var addressStreet = document.createElement("div");
  addressStreet.classList.add("address-street");
  addressStreet.textContent = street;
  addressDetails.appendChild(addressStreet);
  var addressCityStateZip = document.createElement("div");
  addressCityStateZip.classList.add("address-city-state-zip");
  addressCityStateZip.textContent = city + ", " + state + " " + zip;
  addressDetails.appendChild(addressCityStateZip);
  addressItem.appendChild(addressDetails);

  // Create the address actions
  var addressActions = document.createElement("div");
  addressActions.classList.add("address-actions");
  var editAddressBtn = document.createElement("div");
  editAddressBtn.classList.add("edit-address-btn");
  var editAddressBtnButton = document.createElement("button");
  editAddressBtnButton.textContent = "Edit";
  editAddressBtn.appendChild(editAddressBtnButton);
  addressActions.appendChild(editAddressBtn);
  var deleteAddressBtn = document.createElement("div");
  deleteAddressBtn.classList.add("delete-address-btn");
  var deleteAddressBtnButton = document.createElement("button");
  deleteAddressBtnButton.textContent = "Delete";
  deleteAddressBtn.appendChild(deleteAddressBtnButton);
  addressActions.appendChild(deleteAddressBtn);
  addressItem.appendChild(addressActions);

  // Add the address item to the address book
  if (addressType === "shipping") {
    var shippingAddressesTab = document.getElementById("shipping-addresses-tab");
    shippingAddressesTab.appendChild(addressItem);
  } else if (addressType === "billing") {
    var billingAddressesTab = document.getElementById("billing-addresses-tab");
    billingAddressesTab.appendChild(addressItem);
  }

  // Clear the form fields
  nameField.value = "";
  streetField.value = "";
  cityField.value = "";
  stateField.value = "";
  zipField.value = "";

  // Close the modal
  closeModal();
}

// Add event listener to edit address buttons
var editAddressBtns = document.querySelectorAll(".edit-address-btn button");

editAddressBtns.forEach(function(editAddressBtn) {
  editAddressBtn.addEventListener("click", function() {
    // Get the address item
    var addressItem = editAddressBtn.parentNode.parentNode.parentNode;

    // Get the address details
    var addressDetails = addressItem.querySelector(".address-details");

    // Get the address name
    var addressName = addressDetails.querySelector(".address-name").textContent;

    // Get the address street
    var addressStreet = addressDetails.querySelector(".address-street").textContent;

    // Get the address city, state, and zip
    var addressCityStateZip = addressDetails.querySelector(".address-city-state-zip").textContent;

    // Populate the form fields with the address details
    nameField.value = addressName;
    streetField.value = addressStreet;
    cityField.value = addressCityStateZip.split(",")[0].trim();
    stateField.value = addressCityStateZip.split(",")[1].trim().split(" ")[0];
    zipField.value = addressCityStateZip.split(",")[1].trim().split(" ")[1];

    // Open the modal
    openModal();

    // Add event listener to save address button to update address
    saveAddressBtn.addEventListener("click", function() {
      // Get the address type
      var addressType = addressTypeField.value;

      // Get the address details
      var name = nameField.value;
      var street = streetField.value;
      var city = cityField.value;
      var state = stateField.value;
      var zip = zipField.value;

      // Update the address details
      addressDetails.querySelector(".address-name").textContent = name;
      addressDetails.querySelector(".address-street").textContent = street;
      addressDetails.querySelector(".address-city-state-zip").textContent = city + ", " + state + " " + zip;

      // Close the modal
      closeModal();
    });
  });
});

// Add event listener to delete address buttons
var deleteAddressBtns = document.querySelectorAll(".delete-address-btn button");

deleteAddressBtns.forEach(function(deleteAddressBtn) {
  deleteAddressBtn.addEventListener("click", function() {
    // Get the address item
    var addressItem = deleteAddressBtn.parentNode.parentNode.parentNode;

    // Remove the address item
    addressItem.parentNode.removeChild(addressItem);
  });
});

// Add event listener to check all checkbox
var checkAllCheckbox = document.getElementById("check-all");

checkAllCheckbox.addEventListener("change", function() {
  // Get all address checkboxes
  var addressCheckboxes = document.querySelectorAll(".address-checkbox input");

  // Check or uncheck all address checkboxes
  addressCheckboxes.forEach(function(addressCheckbox) {
    addressCheckbox.checked = checkAllCheckbox.checked;
  });
});

// Add event listener to delete all button
var deleteAllButton = document.getElementById("delete-all-btn");

deleteAllButton.addEventListener("click", function() {
  // Get all checked address checkboxes
  var checkedAddressCheckboxes = document.querySelectorAll(".address-checkbox input:checked");

  // Remove all checked address items
  checkedAddressCheckboxes.forEach(function(checkedAddressCheckbox) {
    var addressItem = checkedAddressCheckbox.parentNode.parentNode;
    addressItem.parentNode.removeChild(addressItem);
  });
});

// Add event listener to tab buttons
var tabButtons = document.querySelectorAll(".tab-button");

tabButtons.forEach(function(tabButton) {
  tabButton.addEventListener("click", function() {
    // Get the tab content
    var tabContent = document.getElementById(tabButton.dataset.tab);

    // Show the tab content
    tabContent.classList.add("active");

    // Hide other tab contents
    var otherTabContents = document.querySelectorAll(".tab-content");
    otherTabContents.forEach(function(otherTabContent) {
      if (otherTabContent !== tabContent) {
        otherTabContent.classList.remove("active");
      }
    });

    // Update the active tab button
    var activeTabButton = document.querySelector(".tab-button.active");
    activeTabButton.classList.remove("active");
    tabButton.classList.add("active");
  });
});
