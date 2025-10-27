const controller = require("./gameController");
const dao = require("../Model/gameDao");


jest.mock("../Model/gameDao");

beforeEach(() => {
  jest.clearAllMocks();
});

//Retrieve all games
test("Get All Games", async () => {
  let req = {};
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readAll.mockResolvedValue([{ teamA: "Giants", teamB: "Eagles" }]);
  await controller.getAll(req, res);

  expect(dao.readAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ teamA: "Giants", teamB: "Eagles" }]);
});

//Get a single game
test("Get Game", async () => {
  let req = { params: { id: "1" } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue({ _id: "1", teamA: "A", teamB: "B" });
  await controller.getOne(req, res);

  expect(dao.read).toHaveBeenCalledWith("1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ _id: "1", teamA: "A", teamB: "B" });
});

//Find a game that doesnt exist
test("Get Game", async () => {
  let req = { params: { id: "1" } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue(null);
  await controller.getOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Game not found" });
});

//Creae a Game
test("Create Game", async () => {
  let req = {
    body: { teamA: "Lions", teamB: "Tigers", scoreA: 3, scoreB: 2 },
  };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.create.mockResolvedValue({ teamA: "Lions", teamB: "Tigers" });
  await controller.create(req, res);

  expect(dao.create).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ teamA: "Lions", teamB: "Tigers" });
});

//Create Fail
test("Create Game ", async () => {
  let req = { body: { teamA: "Giants", teamB: "Eagles" } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.create.mockRejectedValue(new Error("DB fail"));
  await controller.create(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to create game" });
});

//Score Update
test("Update Score", async () => {
  let req = { params: { id: "1" }, body: { scoreA: 5, scoreB: 3 } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.update.mockResolvedValue({
    _id: "1",
    scoreA: 5,
    scoreB: 3,
    status: "in-progress",
  });

  await controller.updateScore(req, res);

  expect(dao.update).toHaveBeenCalledWith("1", {
    scoreA: 5,
    scoreB: 3,
    status: "in-progress",
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    _id: "1",
    scoreA: 5,
    scoreB: 3,
    status: "in-progress",
  });
});

//Fail to find Game
test("Update Game Score", async () => {
  let req = { params: { id: "1" }, body: { scoreA: 1, scoreB: 1 } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.update.mockResolvedValue(null);
  await controller.updateScore(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Game not found" });
});

//Save Game
test("Save Game", async () => {
  let req = {
    params: { id: "1" },
    body: { teamA: "Giants", teamB: "Eagles", scoreA: 6, scoreB: 3 },
  };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.update.mockResolvedValue({
    _id: "1",
    teamA: "Giants",
    teamB: "Eagles",
    scoreA: 6,
    scoreB: 3,
    result: "Giants wins",
    status: "finished",
  });

  await controller.finishGame(req, res);

  expect(dao.update).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Game finished and saved to history",
    game: {
      _id: "1",
      teamA: "Giants",
      teamB: "Eagles",
      scoreA: 6,
      scoreB: 3,
      result: "Giants wins",
      status: "finished",
    },
  });
});

//Delete a game
test("Delete game", async () => {
  let req = { params: { id: "1" } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(true);
  await controller.deleteOne(req, res);

  expect(dao.del).toHaveBeenCalledWith("1");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Game deleted successfully",
  });
});

//Delete Game that DNE
test("Delete Game DNE", async () => {
  let req = { params: { id: "1" } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(null);
  await controller.deleteOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Game not found" });
});


//Start new season
test("Delete All", async () => {
  let req = {};
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteAll.mockResolvedValue();
  await controller.deleteAll(req, res);

  expect(dao.deleteAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "All games deleted successfully",
  });
});

//New Season fail
test("Delete All", async () => {
  let req = {};
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.deleteAll.mockRejectedValue(new Error("DB fail"));
  await controller.deleteAll(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: "Failed to delete all games",
  });
});
