const gameModule = require("./gameDao");
const dbConnect = require("../../../DBConnection.js");
require("dotenv").config();


beforeAll(async () => {
  await dbConnect.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await dbConnect.disconnect();
});

afterEach(async () => {
  await gameModule.deleteAll();
});


//Create Game
test("should create a game", async () => {
  const newGame = {
    teamA: "Giants",
    teamB: "Eagles",
    scoreA: 3,
    scoreB: 2,
  };

  const game = await gameModule.create(newGame);

  expect(game).toBeDefined();
  expect(game.teamA).toBe("Giants");
  expect(game.teamB).toBe("Eagles");
  expect(game.status).toBe("in-progress");
});

//Reading Game with specifc id
test("should read a game by ID", async () => {
  const created = await gameModule.create({ teamA: "Sharks", teamB: "Bulls" });
  const found = await gameModule.read(created._id);

  expect(found).not.toBeNull();
  expect(found.teamA).toBe("Sharks");
});

//Readd entire game hist.
test("should read all games", async () => {
  await gameModule.create({ teamA: "A", teamB: "B" });
  await gameModule.create({ teamA: "C", teamB: "D" });

  const games = await gameModule.readAll();

  expect(games.length).toBe(2);
});

//Reading games by team name
test("should read a game by team names", async () => {
  await gameModule.create({ teamA: "Giants", teamB: "Eagles" });
  const found = await gameModule.readByTeams("Giants", "Eagles");

  expect(found).not.toBeNull();
  expect(found.teamA).toBe("Giants");
  expect(found.teamB).toBe("Eagles");
});
//Score update
test("should update a game score", async () => {
  const created = await gameModule.create({ teamA: "Jets", teamB: "Giants" });

  const updated = await gameModule.update(created._id, { scoreA: 5, scoreB: 1 });
  expect(updated.scoreA).toBe(5);
  expect(updated.scoreB).toBe(1);
});

//Deletingn game
test("should delete a game by ID", async () => {
  const game = await gameModule.create({ teamA: "DeleteMe", teamB: "Temp" });
  const deleted = await gameModule.del(game._id);
  const found = await gameModule.read(game._id);

  expect(deleted.teamA).toBe("DeleteMe");
  expect(found).toBeNull();
});
//Clearing all Game History 
test("should delete all games", async () => {
  await gameModule.create({ teamA: "A", teamB: "B" });
  await gameModule.create({ teamA: "C", teamB: "D" });

  await gameModule.deleteAll();
  const games = await gameModule.readAll();

  expect(games.length).toBe(0);
});
