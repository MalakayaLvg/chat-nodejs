const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require("mongoose");
const path = require("path");

const MONGODB_URI = "mongodb://127.0.0.1:27017/chatDB";
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB!');
    })
    .catch((err) => {
        console.error('🔴 Failed to connect to MongoDB:', err.message);
    });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    }
});

const Message = require('./models/Message');

io.on('connection', (socket) => {
    console.log('New user connected');
    console.log('user-Socket ID: ' + socket.id);

    Message.find().sort().then(messages => {
        socket.emit('previousMessages', messages);
    });

    socket.on('message', (message) => {
        console.log('Received message : '+ socket.id)
        console.log(message.content);

        const newMessage = new Message({
            content: message.content
        });

        newMessage.save()
            .then(() => {
                io.emit('message', {
                    author: socket.id,
                    content: message.content,
                });
                console.log('Message saved to database');
            })
            .catch(err => console.error('Failed to save message:', err));
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

server.listen(8080, ()=>{
    console.log('Server listening on port 8080');
});