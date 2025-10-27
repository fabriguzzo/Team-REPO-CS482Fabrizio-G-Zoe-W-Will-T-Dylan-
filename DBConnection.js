const mongoose = require("mongoose");

exports.connect = async function(where){
    let uri = process.env.DB_URI;
    if(where==='test') uri = process.env.TESTDB_URI;
    mongoose.connect(uri);
    await mongoose.connect(uri)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("MongoDB connection error:", err));
    }
exports.disconnect = async function(){
    await mongoose.connection.close();
}