const mongoose = require("mongoose");

exports.connect = function(){
    mongoose.connect(process.env.DB_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("MongoDB connection error:", err));
    }