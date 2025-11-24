const controller = require("./invitationController");
const dao = require("../Model/invitationDao");
const teamDao = require("../Model/teamDao");
const userDao = require("../Model/UserDao");

jest.mock("../Model/invitationDao");
jest.mock("../Model/teamDao");
jest.mock("../Model/UserDao");

beforeEach(() => {
  jest.clearAllMocks();
});



test("getByRecipient – success with parent + child invites", async () => {
  const req = { params: { userId: "parentId" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  userDao.read.mockResolvedValue({ _id: "parentId" }); // parent exists
  userDao.readAll.mockResolvedValue([
    { _id: "parentId" },
    { _id: "child1", parent: "parentId" },
    { _id: "child2", parent: "parentId" },
    { _id: "otherUser", parent: "someoneElse" }
  ]);

  const fakeInvites = [{ id: 1 }, { id: 2 }];
  dao.readByRecipients.mockResolvedValue(fakeInvites);

  await controller.getByRecipient(req, res);

  expect(userDao.read).toHaveBeenCalledWith("parentId");
  expect(userDao.readAll).toHaveBeenCalled();
  expect(dao.readByRecipients).toHaveBeenCalledWith(["parentId", "child1", "child2"]);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(fakeInvites);
});

test("getByRecipient – user not found", async () => {
  const req = { params: { userId: "missingId" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  userDao.read.mockResolvedValue(null);

  await controller.getByRecipient(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
});

test("getByRecipient – error path", async () => {
  const req = { params: { userId: "boom" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  userDao.read.mockRejectedValue(new Error("DB fail"));

  await controller.getByRecipient(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch invitations" });
});



test("getAll – success", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvites = [{ id: 1 }];
  dao.readAll.mockResolvedValue(fakeInvites);

  await controller.getAll(req, res);

  expect(dao.readAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(fakeInvites);
});

test("getAll – error", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readAll.mockRejectedValue(new Error("boom"));

  await controller.getAll(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve invitations" });
});



test("getByTeam – success", async () => {
  const req = { params: { teamId: "team1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvites = [{ id: 1, team: "team1" }];
  dao.readByTeam.mockResolvedValue(fakeInvites);

  await controller.getByTeam(req, res);

  expect(dao.readByTeam).toHaveBeenCalledWith("team1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(fakeInvites);
});

test("getByTeam – error", async () => {
  const req = { params: { teamId: "team1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByTeam.mockRejectedValue(new Error("boom"));

  await controller.getByTeam(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve team invitations" });
});


test("send – success", async () => {
  const req = {
    body: { recipient: "userId", team: "teamId", role: "player" },
    session: { username: "managerUser" }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = { _id: "inv1" };
  dao.create.mockResolvedValue(fakeInvite);

  await controller.send(req, res);

  expect(dao.create).toHaveBeenCalledWith({
    recipient: "userId",
    sender: "managerUser",
    team: "teamId",
    role: "player"
  });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invitation sent",
    invite: fakeInvite
  });
});

test("send – missing fields", async () => {
  const req = {
    body: { recipient: "userId", team: "teamId", role: "player" },
    session: {} // no username
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await controller.send(req, res);

  expect(dao.create).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: "recipient, sender, team, and role are required"
  });
});

test("send – error", async () => {
  const req = {
    body: { recipient: "userId", team: "teamId", role: "player" },
    session: { username: "managerUser" }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.create.mockRejectedValue(new Error("DB fail"));

  await controller.send(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to send invitation" });
});



test("accept – success, player added to team", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = {
    _id: "inv1",
    team: "team1",
    recipient: "user1",
    role: "player"
  };
  dao.updateStatus.mockResolvedValue(fakeInvite);

  const fakeTeam = {
    _id: "team1",
    players: [],
    coach: null,
    manager: null,
    save: jest.fn().mockResolvedValue(true)
  };
  teamDao.read.mockResolvedValue(fakeTeam);

  const fakeUser = { _id: "user1", username: "playerUser" };
  userDao.read.mockResolvedValue(fakeUser);

  await controller.accept(req, res);

  expect(dao.updateStatus).toHaveBeenCalledWith("inv1", "accepted");
  expect(teamDao.read).toHaveBeenCalledWith("team1");
  expect(userDao.read).toHaveBeenCalledWith("user1");
  expect(fakeTeam.players).toContain("playerUser");
  expect(fakeTeam.save).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invitation accepted and team updated",
    invite: fakeInvite,
    team: fakeTeam
  });
});

test("accept – success, coach set", async () => {
  const req = { params: { id: "inv2" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = {
    _id: "inv2",
    team: "team1",
    recipient: "user1",
    role: "coach"
  };
  dao.updateStatus.mockResolvedValue(fakeInvite);

  const fakeTeam = {
    _id: "team1",
    players: [],
    coach: null,
    manager: null,
    save: jest.fn().mockResolvedValue(true)
  };
  teamDao.read.mockResolvedValue(fakeTeam);

  const fakeUser = { _id: "user1", username: "coachUser" };
  userDao.read.mockResolvedValue(fakeUser);

  await controller.accept(req, res);

  expect(fakeTeam.coach).toBe("coachUser");
  expect(fakeTeam.save).toHaveBeenCalled();
});

test("accept – success, manager set", async () => {
  const req = { params: { id: "inv3" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = {
    _id: "inv3",
    team: "team1",
    recipient: "user1",
    role: "manager"
  };
  dao.updateStatus.mockResolvedValue(fakeInvite);

  const fakeTeam = {
    _id: "team1",
    players: [],
    coach: null,
    manager: null,
    save: jest.fn().mockResolvedValue(true)
  };
  teamDao.read.mockResolvedValue(fakeTeam);

  const fakeUser = { _id: "user1", username: "managerUser" };
  userDao.read.mockResolvedValue(fakeUser);

  await controller.accept(req, res);

  expect(fakeTeam.manager).toBe("managerUser");
  expect(fakeTeam.save).toHaveBeenCalled();
});

test("accept – invitation not found", async () => {
  const req = { params: { id: "missing" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockResolvedValue(null);

  await controller.accept(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Invitation not found" });
});

test("accept – team not found", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockResolvedValue({
    _id: "inv1",
    team: "missingTeam",
    recipient: "user1",
    role: "player"
  });
  teamDao.read.mockResolvedValue(null);

  await controller.accept(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
});

test("accept – recipient not found", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockResolvedValue({
    _id: "inv1",
    team: "team1",
    recipient: "user1",
    role: "player"
  });
  teamDao.read.mockResolvedValue({
    _id: "team1",
    players: [],
    coach: null,
    manager: null,
    save: jest.fn().mockResolvedValue(true)
  });
  userDao.read.mockResolvedValue(null);

  await controller.accept(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Recipient user not found" });
});

test("accept – error path", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockRejectedValue(new Error("DB fail"));

  await controller.accept(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to accept invitation" });
});



test("decline – success, player removed if present", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = {
    _id: "inv1",
    team: "team1",
    recipient: "user1",
    role: "player"
  };
  dao.updateStatus.mockResolvedValue(fakeInvite);

  const fakeUser = { _id: "user1", username: "playerUser" };
  userDao.read.mockResolvedValue(fakeUser);

  const fakeTeam = {
    _id: "team1",
    players: ["playerUser"],
    coach: "coachUser",
    save: jest.fn().mockResolvedValue(true)
  };
  teamDao.read.mockResolvedValue(fakeTeam);

  await controller.decline(req, res);

  expect(fakeTeam.players).not.toContain("playerUser");
  expect(fakeTeam.save).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invitation declined and team updated",
    invite: fakeInvite
  });
});

test("decline – success, coach cleared if matches", async () => {
  const req = { params: { id: "inv2" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeInvite = {
    _id: "inv2",
    team: "team1",
    recipient: "user1",
    role: "coach"
  };
  dao.updateStatus.mockResolvedValue(fakeInvite);

  const fakeUser = { _id: "user1", username: "coachUser" };
  userDao.read.mockResolvedValue(fakeUser);

  const fakeTeam = {
    _id: "team1",
    players: [],
    coach: "coachUser",
    save: jest.fn().mockResolvedValue(true)
  };
  teamDao.read.mockResolvedValue(fakeTeam);

  await controller.decline(req, res);

  expect(fakeTeam.coach).toBeNull();
  expect(fakeTeam.save).toHaveBeenCalled();
});

test("decline – invitation not found", async () => {
  const req = { params: { id: "missing" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockResolvedValue(null);

  await controller.decline(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Invitation not found" });
});

test("decline – error path", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateStatus.mockRejectedValue(new Error("DB fail"));

  await controller.decline(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to decline invitation" });
});



test("delete – success", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.delete.mockResolvedValue({ _id: "inv1" });

  await controller.delete(req, res);

  expect(dao.delete).toHaveBeenCalledWith("inv1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: "Invitation deleted" });
});

test("delete – not found", async () => {
  const req = { params: { id: "missing" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.delete.mockResolvedValue(null);

  await controller.delete(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Invitation not found" });
});

test("delete – error", async () => {
  const req = { params: { id: "inv1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.delete.mockRejectedValue(new Error("DB fail"));

  await controller.delete(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete invitation" });
});
