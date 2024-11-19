const socket = io('ws://localhost:8080');

const button = document.querySelector("button");
socket.on('message', (message) => {
    console.log(message);
    const ligne = document.createElement('li')
    ligne.innerHTML = `
        <div class="d-flex justify-content-end mb-3">
            <div>
                <div class="bg-primary text-white rounded-pill px-3 py-2">
                    ${message.content}
                </div>
                <small class="text-muted">${message.author} • ${new Date().toLocaleTimeString()}</small>
            </div>
        </div>
    `
    document.querySelector('ul').appendChild(ligne)
})

socket.on('previousMessages', (message) =>{
    message.forEach(message => {
        const ligne = document.createElement('li')
        ligne.innerHTML = `
        <div class="d-flex mb-3">
            <div class="me-3">
                <div class="bg-secondary text-white rounded-pill px-3 py-2">
                    ${message.content}
                </div>
                <small class="text-muted">${message.author} • 10:45 AM</small>
            </div>
        </div>
        `
        document.querySelector('ul').appendChild(ligne)
    })
})

button.addEventListener('click', (e) => {
    const toSend = document.querySelector('input').value;
    socket.emit('message', {
        content:toSend,
    });
})