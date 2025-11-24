const dao = require("../Model/invitationDao");
const teamDao = require("../Model/teamDao");
const userDao = require("../Model/UserDao");


exports.getByRecipient = async function(req, res) {
  try {
    const userId = req.params.userId;

    // Find the parent user
    const parent = await userDao.read(userId);
    if (!parent) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all children of this parent
    const allUsers = await userDao.readAll();
    const childIds = allUsers
      .filter(u => u.parent && u.parent.toString() === userId)
      .map(u => u._id);

    
    const idsToCheck = [userId, ...childIds];

    
    const invites = await dao.readByRecipients(idsToCheck); 
    

    res.status(200).json(invites);
  } catch (err) {
    console.error("Error fetching invitations:", err);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
};

exports.getAll = async function(req, res) {
  try {
    const invites = await dao.readAll();
    res.status(200).json(invites);
  } catch (err) {
    console.error("Error fetching invitations:", err);
    res.status(500).json({ error: "Failed to retrieve invitations" });
  }
};

exports.getByTeam = async function(req, res) {
  try {
    const teamId = req.params.teamId;
    const invites = await dao.readByTeam(teamId);
    res.status(200).json(invites);
  } catch (err) {
    console.error("Error fetching team invitations:", err);
    res.status(500).json({ error: "Failed to retrieve team invitations" });
  }
};

exports.send = async function(req, res) {
  try {
    const { recipient, team, role } = req.body;
    const sender = req.session.username;

    if (!recipient || !sender || !team || !role) {
      return res.status(400).json({ error: "recipient, sender, team, and role are required" });
    }

    const invite = await dao.create({ recipient, sender, team, role });
    res.status(201).json({ message: "Invitation sent", invite });
  } catch (err) {
    console.error("Error sending invitation:", err);
    res.status(500).json({ error: "Failed to send invitation" });
  }
};
/** 
exports.accept = async function(req, res) {
  try {
    const inviteId = req.params.id;
    const invite = await dao.updateStatus(inviteId, "accepted");
    if (!invite) return res.status(404).json({ error: "Invitation not found" });

    const team = await teamDao.read(invite.team);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const user = await userDao.read(invite.recipient);
    if (!user) return res.status(404).json({ error: "Recipient user not found" });

    if (invite.role === "player") {
      if (!team.players.includes(user.username)) {
        team.players.push(user.username);
      }
    } else if (invite.role === "coach") {
      team.coach = user.username;
    }

    await team.save();

    res.status(200).json({ message: "Invitation accepted and team updated", invite, team });
  } catch (err) {
    console.error("Error accepting invitation:", err);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
};
*/
exports.accept = async function(req, res) {
    try {
      const inviteId = req.params.id;
      const invite = await dao.updateStatus(inviteId, "accepted");
      if (!invite) return res.status(404).json({ error: "Invitation not found" });
  
      const team = await teamDao.read(invite.team);
      if (!team) return res.status(404).json({ error: "Team not found" });
  
      const user = await userDao.read(invite.recipient);
      if (!user) return res.status(404).json({ error: "Recipient user not found" });
  
      if (invite.role === "player") {
        if (!team.players.includes(user.username)) {
          team.players.push(user.username);
        }
      } else if (invite.role === "coach") {
        team.coach = user.username;
      } else if (invite.role === "manager") {
        team.manager = user.username;   // ✅ update manager field
      }
  
      await team.save();
  
      res.status(200).json({ message: "Invitation accepted and team updated", invite, team });
    } catch (err) {
      console.error("Error accepting invitation:", err);
      res.status(500).json({ error: "Failed to accept invitation" });
    }
};

exports.decline = async function(req, res) {
    try {
      const inviteId = req.params.id;
      const invite = await dao.updateStatus(inviteId, "declined");
      if (!invite) return res.status(404).json({ error: "Invitation not found" });
  
      // Remove child from team if they were added
      const team = await teamDao.read(invite.team);
      if (team) {
        const user = await userDao.read(invite.recipient);
        if (user) {
          // If role was player, remove from players array
          if (invite.role === "player") {
            team.players = team.players.filter(p => p !== user.username);
          }
          // If role was coach, clear coach field if it matches
          if (invite.role === "coach" && team.coach === user.username) {
            team.coach = null;
          }
          await team.save();
        }
      }
  
      res.status(200).json({ message: "Invitation declined and team updated", invite });
    } catch (err) {
      console.error("Error declining invitation:", err);
      res.status(500).json({ error: "Failed to decline invitation" });
    }
};
  

exports.delete = async function(req, res) {
  try {
    const inviteId = req.params.id;
    const deleted = await dao.delete(inviteId);
    if (!deleted) return res.status(404).json({ error: "Invitation not found" });

    res.status(200).json({ message: "Invitation deleted" });
  } catch (err) {
    console.error("Error deleting invitation:", err);
    res.status(500).json({ error: "Failed to delete invitation" });
  }
};
