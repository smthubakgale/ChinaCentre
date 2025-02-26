// Get the modal and the button that opens it
var voiceCallModal = document.getElementById("voice-call-modal");
var voiceCallButton = document.querySelector(".chat-header-button");

// Get the close button
var closeButton = document.querySelector(".close");

// Get the end call button
var endCallButton = document.getElementById("end-call-button");

// Open the modal when the voice call button is clicked
voiceCallButton.addEventListener("click", function() {
  voiceCallModal.style.display = "block";
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", function() {
  voiceCallModal.style.display = "none";
});

// Close the modal when the end call button is clicked
endCallButton.addEventListener("click", function() {
  voiceCallModal.style.display = "none";
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function(event) {
  if (event.target == voiceCallModal) {
    voiceCallModal.style.display = "none";
  }
});
