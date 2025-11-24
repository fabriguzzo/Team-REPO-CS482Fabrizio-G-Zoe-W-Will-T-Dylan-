// Docs/Baseball/Model/invitationDao.test.js

const mongoose = require("mongoose");
const dbConnect = require("../../../DBConnection.js");

const invitationDao = require("./invitationDao");
const userDao = require("./UserDao");
const teamDao = require("./teamDao");

require("dotenv").config();

jest.setTimeout(30000); 

beforeAll(async () => {
  await dbConnect.connect();
});

afterAll(async () => {
  await dbConnect.disconnect();
});

afterEach(async () => {
  
  await mongoose.connection.collection("invitations").deleteMany({});
  await mongoose.connection.collection("users").deleteMany({});
  await mongoose.connection.collection("teams").deleteMany({});
});

test("should create an invitation", async () => {
  const user = await userDao.create({
    username: "Dylan",
    password: "123",
    email: "dylan@example.com",
    name: "Dylan Morales",
  });

  const team = await teamDao.create({
    name: "Loyola",
  });

  const newInvite = {
    recipient: user._id,
    sender: user.username, 
    team: team._id,
    role: "player",
  };

  const invite = await invitationDao.create(newInvite);

  expect(invite).toBeDefined();
  expect(invite.recipient.toString()).toBe(user._id.toString());
  expect(invite.team.toString()).toBe(team._id.toString());
  expect(invite.role).toBe("player");
  expect(invite.status).toBe("pending"); // default
});

test("should read all invitations with populated recipient and team", async () => {
  const user = await userDao.create({
    username: "User1",
    password: "123",
    email: "user1@example.com",
    name: "User One",
  });

  const team = await teamDao.create({
    name: "Team One",
  });

  await invitationDao.create({
    recipient: user._id,
    sender: user.username,
    team: team._id,
    role: "coach",
  });

  const invites = await invitationDao.readAll();

  expect(invites.length).toBe(1);
  const invite = invites[0];

  
  expect(invite.recipient).toBeDefined();
  expect(invite.recipient._id.toString()).toBe(user._id.toString());
  expect(invite.team).toBeDefined();
  expect(invite.team._id.toString()).toBe(team._id.toString());
});

test("should read invitations by recipient", async () => {
  const user1 = await userDao.create({
    username: "UserA",
    password: "123",
    email: "usera@example.com",
    name: "User A",
  });

  const user2 = await userDao.create({
    username: "UserB",
    password: "123",
    email: "userb@example.com",
    name: "User B",
  });

  const team = await teamDao.create({ name: "Team X" });

  await invitationDao.create({
    recipient: user1._id,
    sender: "SomeSender",
    team: team._id,
    role: "player",
  });

  await invitationDao.create({
    recipient: user2._id,
    sender: "OtherSender",
    team: team._id,
    role: "coach",
  });

  const invitesForUser1 = await invitationDao.readByRecipient(user1._id);

  expect(invitesForUser1.length).toBe(1);
  const invite = invitesForUser1[0];

  expect(invite.recipient._id.toString()).toBe(user1._id.toString());
  expect(invite.team._id.toString()).toBe(team._id.toString());
});

test("should read invitations by team", async () => {
  const user1 = await userDao.create({
    username: "User1",
    password: "123",
    email: "user1@example.com",
    name: "User 1",
  });

  const user2 = await userDao.create({
    username: "User2",
    password: "123",
    email: "user2@example.com",
    name: "User 2",
  });

  const team1 = await teamDao.create({ name: "Team A" });
  const team2 = await teamDao.create({ name: "Team B" });

  await invitationDao.create({
    recipient: user1._id,
    sender: "SenderA",
    team: team1._id,
    role: "player",
  });

  await invitationDao.create({
    recipient: user2._id,
    sender: "SenderB",
    team: team2._id,
    role: "coach",
  });

  const invitesForTeam1 = await invitationDao.readByTeam(team1._id);

  expect(invitesForTeam1.length).toBe(1);
  const invite = invitesForTeam1[0];

  expect(invite.team._id.toString()).toBe(team1._id.toString());
  expect(invite.recipient._id.toString()).toBe(user1._id.toString());
});

test("should update invitation status", async () => {
  const user = await userDao.create({
    username: "StatusUser",
    password: "123",
    email: "status@example.com",
    name: "Status User",
  });

  const team = await teamDao.create({ name: "Status Team" });

  const invite = await invitationDao.create({
    recipient: user._id,
    sender: "Coach",
    team: team._id,
    role: "manager",
  });

  expect(invite.status).toBe("pending");

  const updated = await invitationDao.updateStatus(invite._id, "accepted");

  expect(updated).toBeDefined();
  expect(updated.status).toBe("accepted");
});

test("should delete an invitation", async () => {
  const user = await userDao.create({
    username: "DeleteUser",
    password: "123",
    email: "delete@example.com",
    name: "Delete User",
  });

  const team = await teamDao.create({ name: "Delete Team" });

  const invite = await invitationDao.create({
    recipient: user._id,
    sender: "Coach",
    team: team._id,
    role: "player",
  });

  const deleted = await invitationDao.delete(invite._id);
  const found = await mongoose
    .connection
    .collection("invitations")
    .findOne({ _id: invite._id });

  expect(deleted).toBeDefined();
  expect(deleted._id.toString()).toBe(invite._id.toString());
  expect(found).toBeNull();
});

test("should read invitations by multiple recipients", async () => {
  const user1 = await userDao.create({
    username: "Multi1",
    password: "123",
    email: "multi1@example.com",
    name: "Multi 1",
  });

  const user2 = await userDao.create({
    username: "Multi2",
    password: "123",
    email: "multi2@example.com",
    name: "Multi 2",
  });

  const user3 = await userDao.create({
    username: "Multi3",
    password: "123",
    email: "multi3@example.com",
    name: "Multi 3",
  });

  const team = await teamDao.create({ name: "Multi Team" });

  await invitationDao.create({
    recipient: user1._id,
    sender: "Sender1",
    team: team._id,
    role: "player",
  });

  await invitationDao.create({
    recipient: user2._id,
    sender: "Sender2",
    team: team._id,
    role: "coach",
  });

  await invitationDao.create({
    recipient: user3._id,
    sender: "Sender3",
    team: team._id,
    role: "manager",
  });

  const invites = await invitationDao.readByRecipients([user1._id, user2._id]);

  expect(invites.length).toBe(2);

  const recipientIds = invites.map((i) => i.recipient._id.toString());
  expect(recipientIds).toContain(user1._id.toString());
  expect(recipientIds).toContain(user2._id.toString());
});
