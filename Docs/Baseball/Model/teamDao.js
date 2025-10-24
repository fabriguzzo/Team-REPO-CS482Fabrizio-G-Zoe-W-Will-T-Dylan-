const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema({
    win: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    loss: { type: Number, default: 0 },
});

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    players: [{ type: String }],
    coach: { type: String },
    manager: { type: String },
    logo: { type: String },
    record: this.recordSchema,
    schedule: [{ type: String }]
});
const recordModel = mongoose.model('Record', this.recordSchema);

const teamModel = mongoose.model('Team', this.teamSchema);

exports.create = async function(newTeam){
    try {
      const team = new teamModel(newTeam)
      await team.save();
      return team;
    } catch (err) {
      console.error("Error:", err);
    }
}

exports.read = async function(id){
    let team = await teamModel.findById(id);
    return team;
}


exports.readAll = async function(){
    let teams = await teamModel.find();
    return teams;
}

exports.del = async function(id){
    let team = await teamModel.findByIdAndDelete(id);
    return team;
} 


exports.deleteAll = async function(){
    await teamModel.deleteMany();
}

exports.update = function(user){
    
}



