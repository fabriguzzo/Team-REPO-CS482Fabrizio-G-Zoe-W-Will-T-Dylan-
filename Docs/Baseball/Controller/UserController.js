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
    const username = req.params.username || req.body.username;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Check if user exists
    const existingUser = await dao.readByUsername(username);

    if (existingUser) {
      // Perform update
      const updatedUser = await dao.updateByUsername(username, req.body);
      return res.status(200).json({
        message: `User "${username}" updated successfully`,
        user: updatedUser,
      });
    } else {
      const rawAge = req.body.age;
      const age = rawAge !== undefined ? parseInt(rawAge, 10) : NaN;
      if (Number.isNaN(age)) {
        return res.status(400).json({ error: 'Age is required to sign up' });
      }
      if (age < 18) {
        return res.status(400).json({ error: 'Cannot sign up as minor; must be under a parent' });
      }
      // Create new user
      const newUser = await dao.create(req.body);
      return res.status(201).json({
        message: `User "${username}" created successfully`,
        user: newUser,
      });
    }
  } catch (err) {
    console.error("Error in createOrUpdate:", err);
    res.status(500).json({ error: "Server error while creating/updating user" });
  }
};


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

exports.login = async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' });
        }
        const user = await dao.readByUsername(username);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        req.session.username = user.username;
        req.session.name = user.name;
        req.session.role = user.role;
        
        const { password: _, ...safeUser } = user.toObject ? user.toObject() : user;
        return res.status(200).json({ message: 'Login successful', user: safeUser });
    } catch (err) {
        console.error('Error duriAng login:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
}

exports.logout = function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Failed to logout" });
        }
        res.clearCookie("connect.sid"); 
        res.json({ message: "Logout successful" });
    });
};



exports.addChild = async function (req, res) {
    try {
        const parentId = req.params.parentId || req.body.parentId;
        if (!parentId) {
            return res.status(400).json({ error: 'parentId is required (param or body)'});
        }

        const childData = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            permission: req.body.permission,
            role: 'child',
            team: req.body.team,
            timeCreated: req.body.timeCreated
        }

        if (!childData.username || !childData.password || !childData.email) {
            return res.status(400).json({ error: 'Missing required child fields: username, password, email' });
        }

        const parent = await dao.read(parentId);
        if (!parent) {
            return res.status(404).json({ error: 'Parent user not found' });
        }

     
        const newChild = await dao.createChild(parent._id, childData);
        res.status(201).json(newChild);
    } catch (err) {
        console.error('Error creating child user:', err);
       
        if (err && err.code === 11000) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to create child user' });
    }
}

