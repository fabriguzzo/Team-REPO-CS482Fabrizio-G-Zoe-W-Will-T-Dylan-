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
