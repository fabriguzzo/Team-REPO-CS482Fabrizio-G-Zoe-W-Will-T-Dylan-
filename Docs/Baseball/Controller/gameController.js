const dao = require('../Model/gameDao.js');

//New game
exports.create = async function (req, res) {
    try {
        const gameData = {
            teamA: req.body.teamA,
            teamB: req.body.teamB,
            scoreA: req.body.scoreA || 0,
            scoreB: req.body.scoreB || 0,
            status: 'in-progress',
            dateCreated: new Date()
        };

        const newGame = await dao.create(gameData);
        res.status(201).json(newGame);
    } catch (err) {
        console.error('Error creating game:', err);
        res.status(500).json({ error: 'Failed to create game' });
    }
};

//Games History
exports.getAll = async function (req, res) {
    try {
        const games = await dao.readAll();
        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).json({ error: 'Failed to retrieve games' });
    }
};

//Fetch a specific game
exports.getOne = async function (req, res) {
    try {
        const id = req.params.id;
        const game = await dao.read(id);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json(game);
    } catch (err) {
        console.error('Error fetching game:', err);
        res.status(500).json({ error: 'Failed to retrieve game' });
    }
};

//Update Score
exports.updateScore = async function (req, res) {
    try {
        const id = req.params.id;
        const { scoreA, scoreB } = req.body;

        const updatedGame = await dao.update(id, {
            scoreA,
            scoreB,
            status: 'in-progress'
        });

        if (!updatedGame) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json(updatedGame);
    } catch (err) {
        console.error('Error updating score:', err);
        res.status(500).json({ error: 'Failed to update score' });
    }
};
//End and Save
exports.finishGame = async function (req, res) {
    try {
        const id = req.params.id;
        const { scoreA, scoreB } = req.body;

        //Final Resut
        //https://www.w3schools.com/js/js_string_templates.asp 
        let result;
        if (scoreA > scoreB) {
            result = `${req.body.teamA || 'Team A'} wins`;
        } else if (scoreB > scoreA) {
            result = `${req.body.teamB || 'Team B'} wins`;
        } else {
            result = 'Draw';
        }

        const finishedGame = await dao.update(id, {
            scoreA,
            scoreB,
            result,
            status: 'finished',
            dateFinished: new Date()
        });

        if (!finishedGame) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({
            message: 'Game finished and saved to history',
            game: finishedGame
        });
    } catch (err) {
        console.error('Error finishing game:', err);
        res.status(500).json({ error: 'Failed to finish game' });
    }
};

//Remove game
exports.deleteOne = async function (req, res) {
    try {
        const id = req.params.id;
        const deleted = await dao.del(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (err) {
        console.error('Error deleting game:', err);
        res.status(500).json({ error: 'Failed to delete game' });
    }
};

//Remove all games histrory
exports.deleteAll = async function (req, res) {
    try {
        await dao.deleteAll();
        res.status(200).json({ message: 'All games deleted successfully' });
    } catch (err) {
        console.error('Error deleting all games:', err);
        res.status(500).json({ error: 'Failed to delete all games' });
    }
};
