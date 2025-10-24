
const dao = require('./Docs/Model/teamDao');


exports.getAll = async function (req, res) {
    try {
        const teams = await dao.readAll();
        res.status(200).json(teams);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ error: 'Failed to retrieve teams' });
    }
};


exports.getOne = async function (req, res) {
    try {
        const id = req.params.id;
        const team = await dao.read(id);

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json(team);
    } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ error: 'Error retrieving team' });
    }
};


exports.createOrUpdate = async function (req, res) {
    const teamData = {
        name: req.body.name,
        players: req.body.players || [],
        coach: req.body.coach,
        manager: req.body.manager,
        logo: req.body.logo,
        record: req.body.record || { win: 0, tie: 0, loss: 0 },
        schedule: req.body.schedule || []
    };

    try {
        // Only admins can update but if not they can create a team
        if (req.body.name && exports.adminCheck(req)) {
            // Update
            const updated = await dao.update(req.body.name, teamData);
            if (updated.modifiedCount > 0) {
                res.status(200).json({ message: 'Team updated successfully' });
            } else {
                res.status(404).json({ error: 'Team not found' });
            }
        } else {
            // Create new team
            const newTeam = await dao.create(teamData);
            res.status(201).json(newTeam);
        }
    } catch (err) {
        console.error('Error creating/updating team:', err);
        res.status(500).json({ error: 'Failed to create or update team' });
    }
};


exports.deleteOne = async function (req, res) {
    const id = req.params.id;

    if (!exports.adminCheck(req)) {
        return res.status(403).json({ error: 'Admin privileges required' });
    }

    try {
        const deleted = await dao.del(id);
        if (deleted) {
            res.status(200).json({ message: 'Team deleted successfully' });
        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    } catch (err) {
        console.error('Error deleting team:', err);
        res.status(500).json({ error: 'Failed to delete team' });
    }
};


exports.deleteAll = async function (req, res) {
    if (!exports.adminCheck(req)) {
        return res.status(403).json({ error: 'Admin privileges required' });
    }

    try {
        await dao.deleteAll();
        res.status(200).json({ message: 'All teams deleted successfully' });
    } catch (err) {
        console.error('Error deleting all teams:', err);
        res.status(500).json({ error: 'Failed to delete all teams' });
    }
};


exports.getByName = async function (req, res) {
    const teamName = req.params.name;

    try {
        const team = await dao.readByName(teamName);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.status(200).json(team);
    } catch (err) {
        console.error('Error finding team by name:', err);
        res.status(500).json({ error: 'Error retrieving team' });
    }
};
