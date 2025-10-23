require("dotenv").config();

const dbConnect = require("./DBConnection.js");

const ExpressApp = require('./App.js');

dbConnect.connect();

ExpressApp.app.listen(process.env.PORT,process.env.HOSTNAME,function(){ // Listen to client requests in hostname:port
    console.log(`Server Running on ${process.env.HOSTNAME}:${process.env.PORT}...`);
});