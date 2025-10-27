const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const teamController = require("./Docs/Baseball/Controller/teamController");
const userController = require("./Docs/Baseball/Controller/UserController");
const gameController = require('./Docs/Baseball/Controller/gameController.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public_html")));

const testPath = path.join(__dirname, "public_html", "test.html");
const addTeamPath = path.join(__dirname, "public_html", "teamMaker.html");
const addUserPath = path.join(__dirname, "public_html", "userMaker.html");
const addGamePath = path.join(__dirname, "public_html", "gameMaker.html");
const addTeamsPath = path.join(__dirname, "public_html", "teamView.html");

app.get("/", (req, res) => res.sendFile(testPath));
app.get("/addTeam", (req, res) => res.sendFile(addTeamPath));
app.get("/addUser", (req, res) => res.sendFile(addUserPath));
app.get("/addGame", (req, res) => res.sendFile(addGamePath));
app.get("/viewTeams", (req, res) => res.sendFile(addTeamsPath));

//  the API routes for team (connected to controller)
app.get("/teams", teamController.getAll);
app.get("/teams/:id", teamController.getOne);
app.get("/teams/name/:name", teamController.getByName);
app.post("/teams", teamController.createOrUpdate);
app.delete("/teams/:id", teamController.deleteOne);
app.delete("/teams", teamController.deleteAll);

//User
app.get("/users", userController.getAll);
app.get("/users/:id", userController.getOneUser);
app.get("/users/name/:name", userController.getByName);
app.post("/users", userController.createOrUpdate);
app.delete("/users/:id", userController.deleteOne);
app.delete("/users", userController.deleteAll);
// const UserCont = require("./Docs/Baseball/Controller/UserController.js");
// app.post('/user',UserCont.postCreateOrUpdate); // register new user
// app.get('/user',UserCont.getAll);

//Game
app.post('/game', gameController.create);
app.get('/game', gameController.getAll);
app.get('/game/:id', gameController.getOne);
app.put('/game/:id/score', gameController.updateScore);
app.put('/game/:id/finish', gameController.finishGame);
app.delete('/game/:id', gameController.deleteOne);
app.delete('/game', gameController.deleteAll);

exports.app = app;
