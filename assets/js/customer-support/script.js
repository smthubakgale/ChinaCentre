
//----------------------------------------------------------------:: 
// Get the canvas element
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const microphone = audioContext.createMediaStreamSource(stream);

// Set up the stream
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    updateWaveform();
  })
  .catch(error => console.error(error));

// Update the waveform
function updateWaveform() {
  requestAnimationFrame(updateWaveform);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  for (let i = 0; i < frequencyData.length; i++) {
    const x = i * canvas.width / frequencyData.length;
    const y = canvas.height / 2 - frequencyData[i] * canvas.height / 256;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
//-----------------------------------------------------------------------::
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
