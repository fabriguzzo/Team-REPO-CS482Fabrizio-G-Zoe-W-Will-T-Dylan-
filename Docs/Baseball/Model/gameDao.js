const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },
    status: { type: String, enum: ['in-progress', 'finished'], default: 'in-progress' },
    result: { type: String },
    dateCreated: { type: Date, default: Date.now },
    dateFinished: { type: Date }
});

// Create the model
const gameModel = mongoose.model('Game', gameSchema);


//Create new game
exports.create = async function(newGame) {
    const game = new gameModel(newGame);
    await game.save();
    return game;
};

//Read one game(ID)
exports.read = async function(id) {
    let game = await gameModel.findById(id);
    return game;
};

//Game History
exports.readAll = async function() {
    let games = await gameModel.find();
    return games;
};

//Read games by team name 
exports.readByTeams = async function(teamA, teamB) {
    let game = await gameModel.findOne({ teamA: teamA, teamB: teamB });
    return game;
};

//Delete a game
exports.del = async function(id) {
    let game = await gameModel.findByIdAndDelete(id);
    return game;
};

//Cleary History - New season
exports.deleteAll = async function() {
    await gameModel.deleteMany();
};

//Update a game(scores/results/status)
exports.update = async function (gameId, updates) {
  await gameModel.updateOne({ _id: gameId }, updates);
  return await gameModel.findById(gameId);
};