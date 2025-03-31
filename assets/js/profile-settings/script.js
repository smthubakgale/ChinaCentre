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
const firstNameInfo = profileInfoContainer.querySelector('.firstname');
const lastNameInfo = profileInfoContainer.querySelector('.lastname');
const emailInfo = profileInfoContainer.querySelector('.email');
const phoneInfo = profileInfoContainer.querySelector('.phone');

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

  var jsonObject = {
     firstname : firstNameField.value ,
     lastname : lastNameField.value ,
     phonenumber : phoneField.value 
  };

  
  const url3 = d_config.url + `update-profile?session=${encodeURIComponent(session)}&jsonObject=${
	encodeURIComponent(JSON.stringify(jsonObject))}`;
	
  fetch(url3)
   .then((response) => response.json())
   .then((data) =>{
      console.log(data);
	
      if(data.success){
	 nex();
      }	
   })
   .catch((err)=>{
      console.error(err); 
   });
	

   function nex(){
     // Update the profile information
        firstNameInfo.textContent = firstNameField.value;
        lastNameInfo.textContent = lastNameField.value;
        emailInfo.textContent = emailField.value;
        phoneInfo.textContent = phoneField.value; 
     // Toggle the display of the profile form and profile information
        profileFormContainer.style.display = 'none';
        profileInfoContainer.style.display = 'block';
     //
   }
});

//: 
const url2 = d_config.url + `get-user?session=${encodeURIComponent(session)}`;
	
fetch(url2)
.then((response) => response.json())
.then((data) => 
{
    console.log(data);
    console.log(firstNameInfo);
	
    if(data.success)
    {
       firstNameField.value = data.user.firstname;
       lastNameField.value = data.user.lastname;
       emailField.value = data.user.email;
       phoneField.value = data.user.phonenumber;
       document.getElementById('profilePhoto').setAttribute('idx' , data.user.idx);
       window.userIdx = data.user.idx;
	    
       firstNameInfo.innerHTML = data.user.firstname; 
       lastNameInfo.textContent = data.user.lastname;
       emailInfo.textContent = data.user.email;
       phoneInfo.textContent = data.user.phonenumber; 
	// Create the modal HTML
	let deleteModalHtml = `
	    <div class="modal fade" id="delete-item-modal" tabindex="-1" role="dialog" aria-labelledby="delete-item-modal-label" aria-hidden="true">
		<div class="modal-dialog" role="document">
		    <div class="modal-content">
			<div class="modal-header">
			    <h5 class="modal-title" id="delete-item-modal-label">Delete Item</h5>
			    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			    </button>
			</div>
			<div class="modal-body">
			    Are you sure you want to delete this item?
			</div>
			<div class="modal-footer">
			    <button type="button" class="btn btn-secondary" id="cancel-delete-item-btn">Cancel</button>
			    <button type="button" class="btn btn-danger" id="delete-item-btn">Delete</button>
			</div>
		    </div>
		</div>
	    </div>
	`;
	// Add the modal HTML to the page
	document.body.innerHTML += deleteModalHtml;
	// Add event listener for delete item button
	document.getElementById('delete-item-btn').addEventListener('click', (e) => {
	         e.preventDefault();

	         let button = document.getElementById('delete-item-modal');
	    
		 const idx = button.getAttribute('idx');
		 const tableName = button.getAttribute('table_name');
		 const tableIdx = button.getAttribute('table_idx');
	
		 fetch(d_config.url + `delete-file?session=${encodeURIComponent(session)}&tableName=${encodeURIComponent(tableName)}` +
				      `&tableIdx=${encodeURIComponent(tableIdx)}&idx=${encodeURIComponent(idx)}`)
		    .then((response) => response.json())
		    .then((data) => {
			console.log(data);
			manageFiles(tableIdx);
			// Hide the modal
			button.style.display = 'none';
		    })
		    .catch((error) => {
			console.error(error);
			// Hide the modal
			button.style.display = 'none';
		    });
	    
	});
	
	// Add event listener for cancel button
	document.getElementById('cancel-delete-item-btn').addEventListener('click', () => {
	    let button = document.getElementById('delete-item-modal');
	    // Hide the modal
	    button.style.display = 'none';
	});
       // Get Image
	 window.requestFile = function()
	 { 
		 console.log('request file list');
		 fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Users&tableIdx=${data.user.idx}`)
		  .then(response => response.json())
		  .then((data) => 
		   {  
			if(data.recordset)
			{
			   console.log(data.recordset); 
			   var proc = true;
			   data.recordset.forEach((item)=>
			   {  
			        if(item.file_name && item.file_size && item.gallery == "NO" && proc)
				{
				   const image = document.createElement('img'); 
				   image.classList.add('profile-picture');
				   image.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Users&idx=${encodeURI(item.idx)}`;
				   document.querySelector(".image-container").innerHTML = image.outerHTML;
	
				   const deleteButton = document.querySelector('#deleteButton');
				   deleteButton.style.display = 'block';
	
				   deleteButton.addEventListener('click' , ()=>
				   {
					  let button = document.getElementById('delete-item-modal');
					  
					  button.setAttribute('idx', item.idx);
					  button.setAttribute('table_name', 'Users');
					  button.setAttribute('table_idx', window.userIdx );  
					  // Show the modal
					    document.getElementById('delete-item-modal').action = "File"; 
					    document.getElementById('delete-item-modal').style.display = 'block';
					    document.getElementById('delete-item-modal').classList.add('show');
					    //
				    });			 
				  }   			 
			   });
			  }
		  })
		  .catch(error => console.error('Error:', error));    
	}
	window.requestFile();
       // 
    }
})
.catch((error) => {
    console.error(error);
});

window.userIdx = null;
window.uploadImage = function(input) {
  let file = input.files[0];
  let fileName = file.name;
  let fileSize = file.size;
  let reader = new FileReader();
  reader.onload = function(event) {
    let base64String = event.target.result;
    let tableIdx = input.getAttribute('idx');
    let tableGallery = input.getAttribute('gallery') == 'YES';
    constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize);
  };
  reader.readAsDataURL(file);
}

function constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize) {
  let tableName = 'Users';

   console.log(base64String, tableIdx, tableGallery,  fileName, fileSize);

  let sqlQuery = base64String;
  const packetSize = 10000;
  const packets = [];

  for (let i = 0; i < sqlQuery.length; i += packetSize) {
    const packetId = Math.floor(i / packetSize);
    const packetData = encodeURIComponent(sqlQuery.slice(i, i + packetSize));
    const isLastPacket = packetId === Math.ceil(sqlQuery.length / packetSize) - 1;

    packets.push({
      clientId: '', // Client ID will be generated on the server-side
      packetId,
      packetData,
      isLastPacket
    });
  }

  packets[0]["tableName"] = tableName;
  packets[0]["tableIdx"] = tableIdx;
  packets[0]["session"] = encodeURIComponent(session);
  packets[packets.length - 1]["tableGallery"] = tableGallery;
  packets[packets.length - 1]["fileName"] = fileName;
  packets[packets.length - 1]["fileSize"] = fileSize;

  // Create a progress bar container
  const progressBarContainer = document.createElement('div');
  progressBarContainer.style.background = '#f0f0f0'; // Grayish background
  progressBarContainer.style.padding = '5px';
  progressBarContainer.style.borderRadius = '5px';
  progressBarContainer.style.width = '200px'; // Adjust the width as needed
  progressBarContainer.style.marginTop = '10px'; // Add some margin top

  // Create a progress bar
  const progressBar = document.createElement('div');
  progressBar.style.width = '0%';
  progressBar.style.height = '20px';
  progressBar.style.background = 'blue';

  // Create a progress text element
  const progressText = document.createElement('span');
  progressText.style.float = 'right';

  progressBarContainer.appendChild(progressBar);
  progressBarContainer.appendChild(progressText);

  input.insertAdjacentElement('afterend', progressBarContainer);

  // Send the first packet to the server to generate the client ID
  fetch(d_config.url + 'receivePacket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packets[0])
  })
  .then((response) => response.json())
  .then((data) => {
    const clientId = data.clientId;
    //console.log(clientId);

    // Send the remaining packets with the generated client ID
    function sendPackets(packets, index = 0) {
      if (index >= packets.length) {
        // Remove the progress bar container
        progressBarContainer.remove();
        // Refresh 
        manageFiles(userIdx);
        //
        return;
      }

      const packet = packets[index];
      packet.clientId = clientId;

      // Update the progress bar and text
      const progress = (index / packets.length) * 100;
      progressBar.style.width = progress + '%';
      progressText.innerText = `${Math.floor(progress)}%`;

      fetch(d_config.url + 'receivePacket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
      })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        sendPackets(packets, index + 1); // Send the next packet
      })
      .catch((error) => console.error(error));
    }

    sendPackets(packets.slice(1));
  })
  .catch((error) => console.error(error));
}

function manageFiles(tableIdx)
{
    window.requestFile();
}
