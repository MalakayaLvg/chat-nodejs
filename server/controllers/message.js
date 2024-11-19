const Message = require("../models/Message");

async function getAllMessages(){
    try {
        return await Message.find().sort({_id: 1})
    } catch (error){
        console.log(error)
    }
}

async function saveMessage(content, author){
    try {
        const newMessage = new Message({ content:content,author:author });
        await newMessage.save();
        return newMessage;
    } catch (error){
        console.log(error);
    }
}

module.exports = {getAllMessages, saveMessage}