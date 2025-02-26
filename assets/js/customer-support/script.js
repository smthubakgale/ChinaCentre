
//----------------------------------------------------------------:: 
// Get the canvas element
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

// Set up the audio context
const audioContext = new AudioContext();

const analyser = audioContext.createAnalyser();
let microphone; 
let stream;
let oncall = false;

// Update the waveform 
function updateWaveform() {
  requestAnimationFrame(updateWaveform);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerY = canvas.height / 2;
  const barWidth = canvas.width / frequencyData.length;
  for (let i = 0; i < frequencyData.length; i++) {
    const barHeight = frequencyData[i] * (centerY - 10) / 256;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(i * barWidth, centerY - barHeight, barWidth, barHeight * 2);
  }
}
//-----------------------------------------------------------------------::
// Get the modal and the button that opens it
var voiceCallModal = document.getElementById("voice-call-modal");
var voiceCallButton = document.querySelector(".chat-header-button");

// Get the end call button
var endCallButton = document.getElementById("end-call-button");

// Open the modal when the voice call button is clicked
voiceCallButton.addEventListener("click", function() {
  voiceCallModal.style.display = "block";

  if(!oncall)
  {
     oncall = true;
     // Set up the stream
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(st => { 
            stream = st;
            
            audioContext.resume();
            microphone = audioContext.createMediaStreamSource(stream); 
            audioContext.resume();
            microphone.connect(analyser);
            analyser.fftSize = 256;
            updateWaveform();
          })
          .catch(error => console.error(error));
      // 
   }
});

// Close the modal when the end call button is clicked
endCallButton.addEventListener("click", function() {
  // Stop the audio context
  audioContext.close();

  // Stop the waveform drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stop the microphone stream
  microphone.disconnect();
  microphone = null;

  // Get the MediaStreamTrack
  const tracks = stream.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  // Release the media resources
  try{ stream.getTracks().forEach(track => track.release()); } catch{} 

  // Hide the modal 
  voiceCallModal.style.display = "none";
  oncall = false; 
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function(event) {
  if (event.target == voiceCallModal) {
    voiceCallModal.style.display = "none";
  }
});
