const socket = io('http://localhost:8080');
const button = document.querySelector("#send-button");
const messageList = document.querySelector("#message-list");

socket.on('previousMessages', (messages) => {
    messages.forEach((message) => {
        const ligne = document.createElement('li');
        ligne.className = 'list-group-item';
        ligne.innerHTML = message.content;
        messageList.appendChild(ligne);
    });
});

socket.on('message', (message) => {
    console.log(message);
    const ligne = document.createElement('li')
    ligne.innerHTML = message.author+ " a écrit : "+message.content;
    document.querySelector('ul').appendChild(ligne)
})

button.addEventListener('click', (e) => {
    const toSend = document.querySelector('input').value;
    socket.emit('message', {
        content: toSend,
    });
})