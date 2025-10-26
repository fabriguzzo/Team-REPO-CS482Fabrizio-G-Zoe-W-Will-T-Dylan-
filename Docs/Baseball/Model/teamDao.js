const mongoose = require('mongoose');




const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    players: [{ type: String }],
    coach: { type: String },
    manager: { type: String },
    logo: { type: String },
    wins: {type: Number},
    ties: {type: Number},
    losses:  {type: Number},
    schedule: [{ type: String }]
});


const teamModel = mongoose.model('Team', teamSchema);

exports.create = async function(newTeam){
    
    const team = new teamModel(newTeam)
    await team.save();
    return team;
    
      
    
}

exports.read = async function(id){
    let team = await teamModel.findById(id);
    return team;
}

exports.readByName = async function(teamName){
    let team = await teamModel.findOne({name : teamName});
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

exports.update = async function(teamName,filter){

    const updated = await teamModel.updateOne({ name: teamName }, filter);

    if (updated.modifiedCount > 0) {
        console.log("Team updated:", filter);
    } else {
        console.log("No matching document found for update.");
    }
    
}



