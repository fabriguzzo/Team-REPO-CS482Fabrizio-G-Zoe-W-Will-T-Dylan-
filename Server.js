require("dotenv").config();

const dbConnect = require("./DBConnection.js");
const ExpressApp = require("./App.js");

const http = require("http");
const { Server } = require("socket.io");
const chatDao = require("./Docs/Baseball/Model/chatDao");


const sessionM = ExpressApp.sessionM;
dbConnect.connect();

//creating http from exp
const server = http.createServer(ExpressApp.app);


//Allowing socketio to utilize exp
const io = new Server(server);
io.use((socket, next) => {
    sessionM(socket.request, socket.request.res || {}, next);
});

//S.io
io.on("connection", (socket) => {
    console.log("User connected");
    const sess = socket.request.session;
    const username = sess && sess.username ? sess.username : "Guest";

    socket.on("chat message", async (text) => {
        const message = {
            user: username,
            text: text
        };
        const saved = await chatDao.createMessage(message);
        io.emit("chat message", saved);
    });
});

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`Server Running on ${process.env.HOSTNAME}:${process.env.PORT}...`);
});
 