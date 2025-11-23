const chatDao = require('./chatDao');
const dbConnect = require("../../../DBConnection.js");
require("dotenv").config();

beforeAll(async () => {
    await dbConnect.connect(test);
});
afterAll(async () => {
    await dbConnect.disconnect();
});
afterEach(async () => {
    await chatDao.deleteAllMessages();
});

test("should create a chat message", async () => {
    const msg = {
        user: "Fabrizio",
        text: "WASUP"
    };

    const created = await chatDao.createMessage(msg);
    expect(created).toBeDefined();
    expect(created.user).toBe("Fabrizio");
    expect(created.text).toBe("WASUP");
});

test("should read recent messages", async () => {
    await chatDao.createMessage({ user: "A", text: "Test A" });
    await chatDao.createMessage({ user: "B", text: "Test B" });

    const messages = await chatDao.getRecentMessages();
    expect(messages.length).toBe(2);
    expect(messages[0].text).toBe("Test A");
    expect(messages[1].text).toBe("Test B");
});

test("should delete one message by id", async () => {
    const msg = await chatDao.createMessage({ user: "X", text: "To delete" });
    const deleted = await chatDao.deleteMessage(msg._id);
    const found = await chatDao.getRecentMessages();
    expect(deleted._id.toString()).toBe(msg._id.toString());
    expect(found.length).toBe(0);
});

test("should delete all messages", async () => {
    await chatDao.createMessage({ user: "FAB", text: "Msg1" });
    await chatDao.createMessage({ user: "WILL", text: "Msg2" });
    await chatDao.deleteAllMessages();
    const messages = await chatDao.getRecentMessages();
    expect(messages.length).toBe(0);
});

 