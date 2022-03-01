const socket = io('http://localhost:3000');
const appChat = document.getElementById('app-chat');
const textChat = document.getElementById('text-chat');
const sendMessage = document.getElementById('send-mess');
let userName = document.getElementById('name');

let username = null;
let users = [];
let messages = [];

while (username == null) {
    username = prompt('Please enter a username');
}

socket.on('new-message-to-client', data => {
    messages.push(data.message);
    rerenderMessages();
});

socket.on('all-messages-to-client', data => {
    messages = data;
    rerenderMessages();
});

socket.on('new-user-to-clients', data => {
    users.push(data);
});

sendMessage.addEventListener('click', (e) => {
    e.preventDefault();
    const message = textChat.value;
    socket.emit('new-message-to-server', { message, sender: username });
    textChat.value = '';
})

const getIncomingMessage = msg => {
    return `
        <span>${msg.sender}</span>
        <li>${msg.message}</li>
    `;
};

const getOutgoingMessage = msg => {
    return `
        <span">${msg.sender}</span>
        <li>${msg.message}</li>
    `;
};

const rerenderMessages = () => {
    var output = '';

    for (let i = 0; i < messages.length; i++) {
        console.log(messages[i]);
        if (messages[i].sender == username) {
            output += getOutgoingMessage(messages[i]);
        } else {
            output += getIncomingMessage(messages[i]);
        }
    }
    appChat.innerHTML = output;
};