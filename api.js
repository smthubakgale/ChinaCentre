// Create a new WebSocket connection
let socket = new WebSocket(d_config.url);

// Flag to track whether the connection is being retried
let retrying = false;

// Handle connection open
socket.onopen = () => {
  console.log('Connected to the WebSocket server');
  retrying = false;

  // Example usage:
sendMessage('Hello, server!');
  
};

// Handle incoming messages
socket.onmessage = (event) => {
  console.log(`Received message: ${event.data}`);
};

// Handle connection close
socket.onclose = () => {
  console.log('Disconnected from the WebSocket server');

  if (!retrying) {
    retrying = true;
    setTimeout(() => {
      console.log('Retrying connection...');
      socket = new WebSocket(socketUrl);
    }, 5000);
  }
};

// Handle errors
socket.onerror = (error) => {
  console.log(`Error occurred: ${error}`);
};

// Send a message to the server
const sendMessage = (message) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.log('Connection is not open. Cannot send message.');
  }
};


