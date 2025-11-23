const controller = require("./chatController");
const dao = require("../Model/chatDao");

jest.mock('../Model/chatDao');

beforeEach(() => {
  jest.clearAllMocks();
});

//GetRec Messages
test("Get Recent Messages", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.getRecentMessages.mockResolvedValue([
    { user: "Fabrizio", text: "Hi" }
  ]);
  await controller.getMessages(req, res);
  expect(dao.getRecentMessages).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith([{ user: "Fabrizio", text: "Hi" }]);
});

test("Get Recent Messages - Error", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.getRecentMessages.mockRejectedValue(new Error("Fail"));
  await controller.getMessages(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to load chat messages" });
});

//DeleteOe Message
test("Delete One Message - Success", async () => {
  const req = { params: { id: "123" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteMessage.mockResolvedValue(true);
  await controller.deleteMessage(req, res);

  expect(dao.deleteMessage).toHaveBeenCalledWith("123");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: "Message Deleted" });
});

test("Delete One Message(Null)", async () => {
  const req = { params: { id: "123" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteMessage.mockResolvedValue(null);
  await controller.deleteMessage(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No message found" });
});

test("Delete One Message(fail)", async () => {
  const req = { params: { id: "123" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteMessage.mockRejectedValue(new Error("Fail"));
  await controller.deleteMessage(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to Delete Message" });
});

//Delete all Messages
test("Delete All Messages(Pass)", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteAllMessages.mockResolvedValue();
  await controller.deleteAllMessages(req, res);
  expect(dao.deleteAllMessages).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: "All messages are gone" });
});

test("Delete All Messages(Fail)", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  dao.deleteAllMessages.mockRejectedValue(new Error("Fail"));
  await controller.deleteAllMessages(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to Delete all Messages" });
});

 