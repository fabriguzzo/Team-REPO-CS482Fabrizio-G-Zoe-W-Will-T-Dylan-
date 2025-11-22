const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');
const session = require("express-session");

const dao = require("./Docs/Baseball/Model/teamDao");
 
const teamController = require("./Docs/Baseball/Controller/teamController");
const userController = require("./Docs/Baseball/Controller/UserController");
const gameController = require('./Docs/Baseball/Controller/gameController.js');
const chatController = require("./Docs/Baseball/Controller/chatController");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
}));


app.use(express.static(path.join(__dirname, "public_html")));

const testPath = path.join(__dirname, "public_html", "test.html");
const addTeamPath = path.join(__dirname, "public_html", "teamMaker.html");
const addUserPath = path.join(__dirname, "public_html", "userMaker.html");
const loginPath = path.join(__dirname, "public_html", "login.html");
const addChildPath = path.join(__dirname, "public_html", "childMaker.html");
const addGamePath = path.join(__dirname, "public_html", "gameMaker.html");
const addTeamsPath = path.join(__dirname, "public_html", "teamView.html");
const deleteUserPath = path.join(__dirname, "public_html", "deleteUser.html");
const viewUserPath = path.join(__dirname, "public_html", "userView.html");
const viewGamesPath = path.join(__dirname, "public_html", "viewGames.html");
const updateUserPath = path.join(__dirname, "public_html", "updateUser.html");
const chatPath = path.join(__dirname, "public_html", "chat.html" );


app.get("/", (req, res) => res.sendFile(testPath));
app.get("/addTeam", (req, res) => res.sendFile(addTeamPath));
app.get("/addUser", (req, res) => res.sendFile(addUserPath));
app.get("/login", (req, res) => res.sendFile(loginPath));
app.get("/signup", (req, res) => res.sendFile(addUserPath));
app.get('/guest', (req, res) => res.redirect('/'));
app.get("/addChild", (req, res) => res.sendFile(addChildPath));
app.get("/addGame", (req, res) => res.sendFile(addGamePath));
app.get("/viewTeams", (req, res) => res.sendFile(addTeamsPath));
app.get("/deleteUser", (req, res) => res.sendFile(deleteUserPath));
app.get("/viewUsers", (req, res) => res.sendFile(viewUserPath));
app.get("/viewGames", (req, res) => res.sendFile(viewGamesPath));
app.get("/updateUser", (req, res) => res.sendFile(updateUserPath));
app.get("/chatRoom", (req, res) => res.sendFile(chatPath));

//create a folder to store logos for teams
const uploadDir = path.join(__dirname, 'public_html', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
});

const upload = multer({ storage });


//  the API routes for team (connected to controller)
app.get("/teams", teamController.getAll);
app.get("/teams/:id", teamController.getOne);
app.get("/teams/name/:name", teamController.getByName);
app.post("/teams", upload.single('logo'), teamController.createOrUpdate);
app.delete("/teams/:id", teamController.deleteOne);
app.delete("/teams", teamController.deleteAll);
//app.use('/uploads', express.static(path.join(__dirname, 'public_html', 'uploads')));
app.get("/teams/:id/logo", async (req, res) => {
    try {
      const team = await dao.read(req.params.id);
      if (team && team.logo && team.logo.data) {
        res.contentType(team.logo.contentType);
        res.send(team.logo.data);
      } else {
        res.status(404).send("Logo not found");
      }
    } catch (err) {
      console.error("Error serving logo:", err);
      res.status(500).send("Server error");
    }
});

//User
app.get("/users", userController.getAll);
app.get("/users/:id", userController.getOneUser);
app.get("/users/name/:name", userController.getByName);
app.post("/users", userController.createOrUpdate);
app.post('/login', userController.login);
app.delete("/users/:id", userController.deleteOne);
app.delete("/users", userController.deleteAll);
app.post('/users/:parentId/children', userController.addChild);
app.put("/users/:username", userController.createOrUpdate);


//Game
app.post('/game', gameController.create);
app.get('/game', gameController.getAll);
app.get('/game/:id', gameController.getOne);
app.put('/game/:id/score', gameController.updateScore);
app.put('/game/:id/finish', gameController.finishGame);
app.delete('/game/:id', gameController.deleteOne);
app.delete('/game', gameController.deleteAll);

//chat
app.get("/api/chat", chatController.getMessages);

exports.app = app;
