const mongoose = require("mongoose");

exports.connect = function(where){
    mongoose.connect(process.env.TESTDB_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("MongoDB connection error:", err));
    }