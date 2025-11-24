const controller = require("./teamController");
const dao = require("../Model/teamDao");

// Mock the DAO module
jest.mock("../Model/teamDao");

beforeEach(() => {
  jest.clearAllMocks();
});

test("Get All Teams", async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  dao.readAll.mockResolvedValue([{ name: "Loyola" }]);

  await controller.getAll(req, res);

  expect(dao.readAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ name: "Loyola" }]);
});

test("Get All Teams - Error", async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  dao.readAll.mockRejectedValue(new Error("DB error"));

  await controller.getAll(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve teams" });
});

test("Get One Team", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue({ _id: "1", name: "Loyola" });

  await controller.getOne(req, res);

  expect(dao.read).toHaveBeenCalledWith("1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ _id: "1", name: "Loyola" });
});

test("Get One Team - Not Found", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue(null);

  await controller.getOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
});

test("Get One Team - Error", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockRejectedValue(new Error("DB fail"));

  await controller.getOne(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving team" });
});

test("Create Team (new team)", async () => {
  const req = {
    body: { name: "New Team", manager: "Coach A" }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeTeam = { name: "New Team", manager: "Coach A" };
  dao.create.mockResolvedValue(fakeTeam);

  await controller.createOrUpdate(req, res);

  // ensure dao.create was called with enriched data
  expect(dao.create).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "New Team",
      manager: "Coach A",
      players: [],
      coach: "", // default
      wins: 0,
      ties: 0,
      losses: 0,
      schedule: []
    })
  );

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: "Team created successfully",
    team: fakeTeam
  });
});

test("Create Team - Error", async () => {
  const req = {
    body: { name: "Bad Team", manager: "X" }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.create.mockRejectedValue(new Error("fail"));

  await controller.createOrUpdate(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: "Server error while creating/updating team"
  });
});

test("Create Team - parses players string JSON", async () => {
  const req = {
    body: {
      name: "JSON Team",
      manager: "M1",
      players: '["Alice","Bob"]'
    }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const fakeTeam = { name: "JSON Team" };
  dao.create.mockResolvedValue(fakeTeam);

  await controller.createOrUpdate(req, res);

  expect(dao.create).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "JSON Team",
      players: ["Alice", "Bob"]
    })
  );
  expect(res.status).toHaveBeenCalledWith(201);
});

test("Update Team (existing team)", async () => {
  const req = {
    body: {
      _id: "123",
      name: "Updated Team",
      manager: "New Manager",
      players: ["P1", "P2"]
    }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  const updatedTeam = {
    _id: "123",
    name: "Updated Team",
    manager: "New Manager",
    players: ["P1", "P2"]
  };

  dao.updateById.mockResolvedValue(updatedTeam);

  await controller.createOrUpdate(req, res);

  expect(dao.updateById).toHaveBeenCalledWith("123", expect.objectContaining({
    _id: "123",
    name: "Updated Team",
    manager: "New Manager",
    players: ["P1", "P2"]
  }));

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Team updated successfully",
    team: updatedTeam
  });
});

test("Update Team - Not Found", async () => {
  const req = {
    body: {
      _id: "999",
      name: "Does Not Exist"
    }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.updateById.mockResolvedValue(null);

  await controller.createOrUpdate(req, res);

  expect(dao.updateById).toHaveBeenCalledWith("999", expect.any(Object));
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "Team not found for update"
  });
});

test("Delete One - Success", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(true);

  await controller.deleteOne(req, res);

  expect(dao.del).toHaveBeenCalledWith("1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Team deleted successfully"
  });
});

test("Delete One - Not Found", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(false);

  await controller.deleteOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
});

test("Delete One - Error", async () => {
  const req = { params: { id: "1" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockRejectedValue(new Error("DB fail"));

  await controller.deleteOne(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete team" });
});

test("Delete All Teams", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteAll.mockResolvedValue();

  await controller.deleteAll(req, res);

  expect(dao.deleteAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "All teams deleted successfully"
  });
});

test("Delete All Teams - Error", async () => {
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteAll.mockRejectedValue(new Error("DB fail"));

  await controller.deleteAll(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: "Failed to delete all teams"
  });
});

test("Get Team By Name", async () => {
  const req = { params: { name: "Loyola" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByName.mockResolvedValue({ name: "Loyola" });

  await controller.getByName(req, res);

  expect(dao.readByName).toHaveBeenCalledWith("Loyola");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ name: "Loyola" });
});

test("Get Team By Name - Not Found", async () => {
  const req = { params: { name: "Nope" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByName.mockResolvedValue(null);

  await controller.getByName(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
});

test("Get Team By Name - Error", async () => {
  const req = { params: { name: "Bad" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByName.mockRejectedValue(new Error("DB fail"));

  await controller.getByName(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving team" });
});
