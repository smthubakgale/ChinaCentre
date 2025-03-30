// Get the edit button
const editButton = document.querySelector('.edit-button');

// Get the profile information and form containers
const profileInfoContainer = document.querySelector('.profile-information');
const profileFormContainer = document.querySelector('.profile-form');

// Get the form fields
const firstNameField = profileFormContainer.querySelector('input[name="first-name"]');
const lastNameField = profileFormContainer.querySelector('input[name="last-name"]');
const emailField = profileFormContainer.querySelector('input[name="email"]');
const phoneField = profileFormContainer.querySelector('input[name="phone"]');

// Get the profile information fields
const firstNameInfo = profileInfoContainer.querySelector('.info-value:first-child');
const lastNameInfo = profileInfoContainer.querySelector('.info-value:nth-child(2)');
const emailInfo = profileInfoContainer.querySelector('.info-value:nth-child(3)');
const phoneInfo = profileInfoContainer.querySelector('.info-value:nth-child(4)');

// Add an event listener to the edit button
editButton.addEventListener('click', () => {
  // Toggle the display of the profile form and profile information
  profileFormContainer.style.display = profileFormContainer.style.display === 'block' ? 'none' : 'block';
  profileInfoContainer.style.display = profileInfoContainer.style.display === 'block' ? 'none' : 'block';
});

// Add an event listener to the form submit button
profileFormContainer.querySelector('button[type="submit"]').addEventListener('click', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Update the profile information
  firstNameInfo.textContent = firstNameField.value;
  lastNameInfo.textContent = lastNameField.value;
  emailInfo.textContent = emailField.value;
  phoneInfo.textContent = phoneField.value;

  // Toggle the display of the profile form and profile information
  profileFormContainer.style.display = 'none';
  profileInfoContainer.style.display = 'block';
});

//: 
const url2 = d_config.url + `get-user?session=${encodeURIComponent(session)}`;
	
fetch(url2)
.then((response) => response.json())
.then((data) => 
{
    console.log(data);
    if(data.success)
    {
       firstNameField.value = data.user.firstname;
       lastNameField.value = data.user.lastname;
       emailField.value = data.user.email;
       phoneField.value = data.user.phonenumber;
	    
       firstNameInfo.textContent = data.user.firstname; 
       lastNameInfo.textContent = data.user.lastname;
       emailInfo.textContent = data.user.email;
       phoneInfo.textContent = data.user.phonenumber; 
    }
})
.catch((error) => {
    console.error(error);
});
  
//: 
