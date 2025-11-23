const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
    user: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

module.exports = {
    createMessage: (data) => ChatMessage.create(data),
    getRecentMessages: () =>
        ChatMessage.find().sort({ timestamp: 1 }).limit(50),
    deleteMessage: (id) =>
        ChatMessage.findByIdAndDelete(id),
    deleteAllMessages: () =>
        ChatMessage.deleteMany({})
};
 