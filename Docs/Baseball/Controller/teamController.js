const dao = require('../Model/teamDao');
const fs = require('fs');

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
  try {
    const teamData = req.body;

    
    if (typeof teamData.players !== 'undefined') {
      if (Array.isArray(teamData.players)) {
        // already an array, leave it
      } else if (typeof teamData.players === 'string') {
        const trimmed = teamData.players.trim();
        if (trimmed === '') {
          teamData.players = [];
        } else {
          try {
            teamData.players = JSON.parse(trimmed);
          } catch (err) {
            console.error('Invalid players JSON:', err);
            teamData.players = trimmed.split(',').map(s => s.trim()).filter(Boolean);
          }
        }
      } else {
        teamData.players = [];
      }
    }

    
    if (req.file) {
      teamData.logo = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
      };
      fs.unlinkSync(req.file.path); // cleanup temp file
    }

    
    if (teamData._id) {
      const updatedTeam = await dao.updateById(teamData._id, teamData);
      if (!updatedTeam) {
        return res.status(404).json({ error: 'Team not found for update' });
      }
      return res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    }

    
    const newTeam = await dao.create({
      ...teamData,
      players: teamData.players || [],
      coach: teamData.coach || "",
      wins: 0,
      ties: 0,
      losses: 0,
      schedule: []
    });
    return res.status(201).json({ message: 'Team created successfully', team: newTeam });

  } catch (err) {
    console.error('Error in createOrUpdate:', err);
    res.status(500).json({ error: 'Server error while creating/updating team' });
  }
};

exports.deleteOne = async function (req, res) {
  const id = req.params.id;
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
