// Get the modal
var modal = document.getElementById("add-address-modal");

// Get the button that opens the modal
var btn = document.getElementById("add-address-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Get the delete all button
var deleteAllBtn = document.getElementById("delete-all-btn");

// Get all the checkboxes
var checkboxes = document.querySelectorAll(".address-checkbox-input");

// Add event listener to delete all button
deleteAllBtn.addEventListener("click", function() {
  // Loop through all the checkboxes
  checkboxes.forEach(function(checkbox) {
    // If the checkbox is checked, delete the address item
    if (checkbox.checked) {
      var addressItem = checkbox.parentNode.parentNode;
      addressItem.remove();
    }
  });
});

// Get all the address items
var addressItems = document.querySelectorAll(".address-item");

// Add event listener to each address item
addressItems.forEach(function(addressItem) {
  // Get the delete button
  var deleteBtn = addressItem.querySelector(".delete-address-btn button");

  // Add event listener to delete button
  deleteBtn.addEventListener("click", function() {
    // Remove the address item
    addressItem.remove();
  });
});

// Get the save address button
var saveAddressBtn = document.getElementById("save-address-btn");

// Add event listener to save address button
saveAddressBtn.addEventListener("click", function() {
  // Get the address form data
  var name = document.getElementById("name").value;
  var street = document.getElementById("street").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip").value;
  var addressType = document.getElementById("address-type").value;

  // Create a new address item
  var newAddressItem = document.createElement("div");
  newAddressItem.classList.add("address-item");

  // Create the address checkbox
  var addressCheckbox = document.createElement("div");
  addressCheckbox.classList.add("address-checkbox");
  var checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  checkboxInput.classList.add("address-checkbox-input");
  addressCheckbox.appendChild(checkboxInput);

  // Create the address details
  var addressDetails = document.createElement("div");
  addressDetails.classList.add("address-details");
  var addressName = document.createElement("div");
  addressName.classList.add("address-name");
  addressName.textContent = name;
  var addressStreet = document.createElement("div");
  addressStreet.classList.add("address-street");
  addressStreet.textContent = street;
  var addressCityStateZip = document.createElement("div");
  addressCityStateZip.classList.add("address-city-state-zip");
  addressCityStateZip.textContent = city + ", " + state + " " + zip;
  addressDetails.appendChild(addressName);
  addressDetails.appendChild(addressStreet);
  addressDetails.appendChild(addressCityStateZip);

  // Create the address actions
  var addressActions = document.createElement("div");
  addressActions.classList.add("address-actions");
  var editAddressBtn = document.createElement("div");
  editAddressBtn.classList.add("edit-address-btn");
  var editAddressBtnButton = document.createElement("button");
  editAddressBtnButton.textContent = "Edit";
  editAddressBtn.appendChild(editAddressBtnButton);
  var deleteAddressBtn = document.createElement("div");
  deleteAddressBtn.classList.add("delete-address-btn");
  var deleteAddressBtnButton = document.createElement("button");
  deleteAddressBtnButton.textContent = "Delete";
  deleteAddressBtn.appendChild(deleteAddressBtnButton);
  addressActions.appendChild(editAddressBtn);
  addressActions.appendChild(deleteAddressBtn);

  // Append the address checkbox, details, and actions to the new address item
  newAddressItem.appendChild(addressCheckbox);
  newAddressItem.appendChild(addressDetails);
  newAddressItem.appendChild(addressActions);

  // Append the new address item to the address book items
  var addressBookItems = document.querySelector(".address-book-items");
  addressBookItems.appendChild(newAddressItem);

  // Clear the form data
  document.getElementById("name").value = "";
  document.getElementById("street").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("zip").value = "";
  document.getElementById("address-type").value = "";
});

// Get the check all checkbox
var checkAllCheckbox = document.getElementById("check-all");

// Add event listener to check all checkbox
checkAllCheckbox.addEventListener("change", function() {
  // Get all the checkboxes
  var checkboxes = document.querySelectorAll(".address-checkbox-input");

  // If the check all checkbox is checked, check all the checkboxes
  if (checkAllCheckbox.checked) {
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = true;
    });
  } else {
    // If the check all checkbox is not checked, uncheck all the checkboxes
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
    });
  }
});

// Get the shipping addresses tab button
var shippingAddressesTabBtn = document.getElementById("shipping-tab");

// Add event listener to shipping addresses tab button
shippingAddressesTabBtn.addEventListener("click", function() {
  // Get the shipping addresses tab
  var shippingAddressesTab = document.querySelector(".shipping-addresses-tab");

  // Get the billing addresses tab
  var billingAddressesTab = document.querySelector(".billing-addresses-tab");

  // Show the shipping addresses tab
  shippingAddressesTab.classList.add("active");

  // Hide the billing addresses tab
  billingAddressesTab.classList.remove("active");

  // Remove the active class from the billing addresses tab button
  document.getElementById("billing-tab").classList.remove("active");

  // Add the active class to the shipping addresses tab button
  shippingAddressesTabBtn.classList.add("active");
});

// Get the billing addresses tab button
var billingAddressesTabBtn = document.getElementById("billing-tab");

// Add event listener to billing addresses tab button
billingAddressesTabBtn.addEventListener("click", function() {
  // Get the shipping addresses tab
  var shippingAddressesTab = document.querySelector(".shipping-addresses-tab");

  // Get the billing addresses tab
  var billingAddressesTab = document.querySelector(".billing-addresses-tab");

  // Hide the shipping addresses tab
  shippingAddressesTab.classList.remove("active");

  // Show the billing addresses tab
  billingAddressesTab.classList.add("active");

  // Remove the active class from the shipping addresses tab button
  document.getElementById("shipping-tab").classList.remove("active");

  // Add the active class to the billing addresses tab button
  billingAddressesTabBtn.classList.add("active");
});

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
    document.getElementById("name").value = addressName;
    document.getElementById("street").value = addressStreet;
    document.getElementById("city").value = addressCityStateZip.split(",")[0];
    document.getElementById("state").value = addressCityStateZip.split(",")[1].split(" ")[0];
    document.getElementById("zip").value = addressCityStateZip.split(",")[1].split(" ")[1];

    // Show the modal
    modal.style.display = "block";

    // Add event listener to save address button to update the address item
    saveAddressBtn.addEventListener("click", function() {
      // Get the updated address details
      var updatedAddressName = document.getElementById("name").value;
      var updatedAddressStreet = document.getElementById("street").value;
      var updatedAddressCity = document.getElementById("city").value;
      var updatedAddressState = document.getElementById("state").value;
      var updatedAddressZip = document.getElementById("zip").value;

      // Update the address item
      addressDetails.querySelector(".address-name").textContent = updatedAddressName;
      addressDetails.querySelector(".address-street").textContent = updatedAddressStreet;
      addressDetails.querySelector(".address-city-state-zip").textContent = updatedAddressCity + ", " + updatedAddressState + " " + updatedAddressZip;

      // Hide the modal
      modal.style.display = "none";
    });
  });
});


