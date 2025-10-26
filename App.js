const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const teamController = require("./Docs/Baseball/Controller/teamController");
const userController = require("./Docs/Baseball/Controller/UserController");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public_html")));

const testPath = path.join(__dirname, "public_html", "test.html");
const addTeamPath = path.join(__dirname, "public_html", "teamMaker.html");
const addUserPath = path.join(__dirname, "public_html", "userMaker.html");

app.get("/", (req, res) => res.sendFile(testPath));
app.get("/addTeam", (req, res) => res.sendFile(addTeamPath));
app.get("/addUser", (req, res) => res.sendFile(addUserPath));

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

exports.app = app;