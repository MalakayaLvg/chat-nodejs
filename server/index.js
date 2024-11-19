const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://127.0.0.1:27017/chatsocket";
const MessageController = require("./controllers/message");

const { Pool } = require('pg');
const { Sequalize } = require('sequelize');
const { User } = require('./models');

// MONGODB

mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log("Connecter à mongoDB !")
    })
    .catch((error)=>{
        console.log(error)
    })

// PSQL

const pool = new Pool({
    user: "jeremy",
    host: "localhost",
    database: "chatty",
    password: "jeremymdp",
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erreur lors de la connexion à PostgreSQL :', err);
    } else {
        console.log('Connexion réussie à PostgreSQL à :', res.rows[0].now);
    }
});

// SOCKET

const server = http.createServer(app);

const io = socketIo(server, {
    transport: ["websocket","polling"],
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    }
});

io.on('connection', async(socket) => {
    console.log('New user connect to the server');
    console.log('user-Socker ID :'+ socket.id);

    try {

        let user = await User.findOne({where: {socket_id: socket.id}});
        if (!user){
            user = await User.create({socket_id:socket.id});
            console.log(`utilisateur ajouté à la base de donnée psql avec socjet id: ${socket.id}`)
        }

        const messages = await MessageController.getAllMessages()
        socket.emit('previousMessages', messages)
    } catch (error) {
        console.log(error)
    }

    socket.on('message', async (message) => {
        console.log('Received message from ' + socket.id);
        console.log(message.content);


        try{
            const user = await User.findOne({where: { socket_id: socket.id}})
            if (user) {
                // Sauvegarder le message avec le contenu et l'auteur
                const savedMessage = await MessageController.saveMessage(message.content, user.socket_id);

                // Diffuser le message à tous les utilisateurs
                io.emit('message', {
                    author: user.socket_id,  // On envoie le socket_id comme auteur du message
                    content: savedMessage.content
                });
            } else {
                console.error('Utilisateur non trouvé pour socket_id:', socket.id);
            }
        }catch (error) {
            console.log(error);
        }finally {
            console.log('Broadcasted message to all clients');
            console.log(io.sockets.sockets.size);
        }
    })

    socket.on('disconnect', async ()=>{
        console.log(`Utilisateur déconnecté: ${socket.id}`)
    })

})

server.listen(8080, ()=>{
    console.log('Server listening on port 8080');
});