
const http = require('http');
const socketIo = require('socket.io')

const server = http.createServer((req,res) => {

    res.writeHead(200, {'Content-type': "text/plain" });
    res.end("serveur socket.io en fonctionnement");

})

const io = socketIo(server, {
    transport: ["websocket","polling"],
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    }
});


io.on('connection', (socket) => {
    console.log('New user connect to the server');
    console.log('user-Socker ID :'+ socket.id);



    socket.on('message', (message) => {
        console.log('Received message from ' + socket.id);
        console.log(message.content);

        try{
            io.emit('message',{
                author : socket.id,
                content: message.content,
            });
        }catch (e) {
            console.log(e);
        }finally {
            console.log('Broadcasted message to all clients');
            console.log(io.sockets.sockets.size);
        }
    })

})

server.listen(8080, ()=>{
    console.log('Server listening on port 8080');
});