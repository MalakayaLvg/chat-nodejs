const socket = io('wss://chatserver.malakayalauvergnat.com');
const button = document.querySelector("button");

socket.on('message', (message) => {
    console.log(message)
    const ligne = document.createElement('li')
    ligne.innerHTML = message;
    document.querySelector('ul').appendChild(ligne);
})

document.querySelector('button').addEventListener('click', (e) => {
    const toSend = document.querySelector('input').value;
    socket.emit('message', {
        content:toSend,
    });

})