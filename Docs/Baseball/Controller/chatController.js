const chatDao = require("../Model/chatDao");

exports.getMessages = async function (req, res) {
    try {
        const messages = await chatDao.getRecentMessages();
        res.json(messages);
    } catch (err) {
        console.error("Error loading chat messages:", err);
        res.status(500).json({ error: "Failed to load chat messages" });
    }
};

//DeleteOne
exports.deleteMessage = async function (req, res) {
    try {
        const id = req.params.id;
        const deleted = await chatDao.deleteMessage(id);

        if (!deleted) {
            return res.status(404).json({ error: "No message found" });
        }
        res.status(200).json({ message: "Message Deleted" });
    } catch (err) {
        console.error("Error dmessage:", err);
        res.status(500).json({ error: "Failed to Delete Message" });
    }
};

//DeleteALL
exports.deleteAllMessages = async function (req, res) {
    try {
        await chatDao.deleteAllMessages();
        res.status(200).json({ message: "All messages are gone" });
    } catch (err) {
        console.error("Error da messages:", err);
        res.status(500).json({ error: "Failed to Delete all Messages" });
    }
};

