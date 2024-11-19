const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content : { type: mongoose.SchemaTypes.String },
    author: { type: mongoose.SchemaTypes.String }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;