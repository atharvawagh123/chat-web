// Connect to the server via Socket.IO
const socket = io('http://localhost:5000');  // Ensure this matches the server URL

// Elements for the frontend
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');


// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

// Send message when the form is submitted
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); // Display the sent message on the right
    socket.emit('send', message); // Emit the message to the server
    messageInput.value = ''; // Clear the input field
});

// Prompt user for their name and join the chat
let name = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name); // Notify the server of the new user

// Handle when a new user joins the chat
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'left');
});

// Handle when a message is received from the server
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Handle when a user leaves the chat
socket.on('left', (name) => {
    append(`${name} left the chat`, 'left');
});
