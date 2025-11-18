require('dotenv').config();
const mongoose = require('mongoose');
const userDao = require('../../Model/UserDao.js');
const dbconn = require("../../../../DBConnection.js");

const TEST_USER = {
    username: "test",
    password: "123456",
    email: "test@test.com",
    name: "Test Name"
};

beforeAll(async () => {
    await dbconn.connect();
});

afterAll(async () => {
    await userDao.deleteAll();
    await mongoose.connection.close();
});

test("create a user", async () => {
    const created_user = await userDao.create(TEST_USER);
    expect(created_user).toBeDefined();
    expect(created_user.username).toBe(TEST_USER.username);
    expect(created_user.email).toBe(TEST_USER.email);
});

test("read all users", async () => {
    const users = await userDao.readAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
});

test("read user by username", async () => {
    const user = await userDao.readByUsername(TEST_USER.username);
    expect(user).toBeDefined();
    expect(user.username).toBe(TEST_USER.username);
});

test("read user by ID", async () => {
    const user = await userDao.readByUsername(TEST_USER.username);
    const byId = await userDao.read(user._id);
    expect(byId).toBeDefined();
    expect(byId.username).toBe(TEST_USER.username);
});

test("read user by name", async () => {
    const user = await userDao.readByName(TEST_USER.name);
    expect(user).toBeDefined();
    expect(user.name).toBe(TEST_USER.name);
});

test("update a user by username", async () => {
    const updated = await userDao.updateByUsername(TEST_USER.username, { role: "admin" });
    expect(updated).toBeDefined();
    expect(updated.role).toBe("admin");
});

test("create a child user", async () => {
    const parent = await userDao.readByUsername(TEST_USER.username);

    const childData = {
        username: "test_child",
        password: "123456",
        email: "child@test.com"
    };

    const child = await userDao.createChild(parent._id, childData);
    expect(child).toBeDefined();
    expect(child.role).toBe("player");
    expect(child.parent.toString()).toBe(parent._id.toString());
});

test("delete a user by username", async () => {
    const deleted = await userDao.delete("test_child");
    expect(deleted).toBeDefined();
    expect(deleted.username).toBe("test_child");
});

test("delete all users", async () => {
    const deleted_users = await userDao.deleteAll();
    expect(deleted_users).toBeDefined();
});
