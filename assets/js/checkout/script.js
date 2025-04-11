let req_page = true; 

let del = document.querySelector(".delivery-mode");
if(req_page){
   req_page = false;
  del.addEventListener("change", (e) => {
     localStorage.setItem('chinacentre-delivery', e.target.value);
     require_delivery = e.target.value;
     console.log(require_delivery);
     console.log(e.target);
  });
}

if(require_delivery == "require-delivery"){
   del.value = "require-delivery";
}
else {
   del.value = "store-collection";   
  }

// 1. User Info 

const url2 = d_config.url + `get-user?session=${encodeURIComponent(session)}`;
	
fetch(url2)
.then((response) => response.json())
.then((data) => 
{
    console.log(data); 
	
    if(data.success)
    {
       let dets = document.querySelector(".udets");
       
       dets.innerHTML = `<span> ${data.user.firstname} </span> <span> ${data.user.lastname} </span`;
       dets.style.opacity = 1; 
    }
})
.catch((error) => {
    console.error(error);
});
//

const shippingInfo = document.querySelector('.shipping-info'); 
const addressOptions = document.querySelector('.address-options');  

const changeButton = addressOptions.querySelector('.change-button');
const editButton = addressOptions.querySelector('.edit-button');
const deleteButton = addressOptions.querySelector('.delete-button');  

const paymentMethodSelect = document.getElementById('payment-method-select');
const paymentMethodForms = document.querySelectorAll('.payment-methods div[id$="-form-div"]');

const summaryHeader = document.querySelector('.summary-header');
const hiddenDiv = document.querySelector('.hidden');

summaryHeader.addEventListener('click', () => {
  const chevronIcon = summaryHeader.querySelector('i');
  if (chevronIcon.classList.contains('fa-chevron-down')) {
    chevronIcon.classList.remove('fa-chevron-down');
    chevronIcon.classList.add('fa-chevron-up');
    hiddenDiv.style.display = 'block';
  } else {
    chevronIcon.classList.remove('fa-chevron-up');
    chevronIcon.classList.add('fa-chevron-down');
    hiddenDiv.style.display = 'none';
  }
});
// 
paymentMethodSelect.addEventListener('change', () => {
  const selectedMethod = paymentMethodSelect.value;
  paymentMethodForms.forEach((form) => {
    if (form.id === `${selectedMethod}-form-div`) {
      form.style.display = 'block';
    } else {
      form.style.display = 'none';
    }
  });
});
// 
changeButton.addEventListener('click', () => {
  shippingInfo.classList.remove("edit-change");
  shippingInfo.classList.add("address-change");
});

editButton.addEventListener('click', () => {
  shippingInfo.classList.remove("address-change");
  shippingInfo.classList.add("edit-change");
});
//
function checkDeliveryMode() {
  const deliveryModeSelect = document.querySelector('.delivery-mode');
  const mainContainer = document.querySelector('.main-container');

  if (deliveryModeSelect.value === 'collection') {
    mainContainer.classList.add('m-delivery');
  } else {
    mainContainer.classList.remove('m-delivery');
  }
}

// Initially call the function
checkDeliveryMode();

// Call the function on change event listener
document.querySelector('.delivery-mode').addEventListener('change', checkDeliveryMode);
