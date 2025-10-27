const dao = require('../Model/UserDao.js');

exports.getAll = async function (req, res) {
    try {
        const users = await dao.readAll();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to retrieve users'});
    }
}

exports.getOneUser = async function (req, res) {
    try {
        const username = req.params.username;
        const user = await dao.read(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user', err);
        res.status(500).json({ error: 'Error retrieving user'});
    }
}

exports.createOrUpdate = async function (req, res) {
    try {
        const userData = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            permission: req.body.permission,
            name: req.body.name,
            role: req.body.role,
            team: req.body.team,
            timeCreated: req.body.timeCreated
        }

        //Create new user
        const newUser = await dao.create(userData);
        res.status(201).json(newUser);

    } catch(err) {
        console.error("Error creating/updating user", err);
        res.status(500).json({error: "Failed to create/update user"});
    }
}

exports.deleteOne = async function (req, res) {
    const user = req.params.username;

    // if (!exports.adminCheck(req)) {
    //     return res.status(403).json ({ error: "Admin privileges required"});
    // }

    try {
        const deleted = await dao.delete(user);
        if (deleted) {
            res.status(200).json ({ message: "User deleted successfully"});
        } else {
            res.status(404).json({ error: "User not found"});
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: "Failed to delete user"});
    }
}

exports.deleteAll = async function (req, res) {
    // if (!exports.adminCheck(req)) {
    //     return res.status(403).json({ error: 'Admin privileges required'});
    // }

    try {
        await dao.deleteAll();
        res.status(200).json({ message: "All users deleted successfully"});
    } catch (err) {
        console.error("Error deleting all users:", err);
        res.status(500).json({ error: 'Failed to delete all users'});
    }
}

exports.getByName = async function (req, res) {
    const userName = req.params.name;

    try {
        const user = await dao.readByName(userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error finding user by name:', err);
        res.status(500).json({ error: "Error retrieving user"});
    }
}