const userDao = require('../../Model/UserDao.js');
const dbconn = require("../../../../DBConnection.js");


test("create a user", async () => {
    dbconn.connect()

    test_user = {
        username: "testuser",
        password: "unsecurepassword",
        email: "testuser123@test.com"
    }

    const created_user = await userDao.create(test_user);

    expect(created_user).not.toBeUndefined();
})

test("delete all users", async () => {
    dbconn.connect()

    const deleted_users = await userDao.deleteAll();
    expect(deleted_users).not.toBeUndefined();
})