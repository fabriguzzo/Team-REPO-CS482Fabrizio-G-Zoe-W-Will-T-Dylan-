import mongoose from 'mongoose';
import { Team } from './team.js';




mongoose.connect('mongodb+srv://dpmorales777_db_user:pCkylHNN2NfyUT5G@cluster0.grq5znw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

const recordSchema = new mongoose.Schema({
    win: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    loss: { type: Number, default: 0 },
});

//schematic for how the data will be stored in the database
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    players: [{ type: String }],  
    coach: { type: String },
    manager: { type: String },
    logo: { type: String }, 
    record: recordSchema,
    schedule: [{ type: String }]
  });

//make an object BaseballTeam with schema as attributes
const BaseballTeam = mongoose.model('Team', teamSchema);

const Record = mongoose.model('Record', recordSchema);

async function run() {
    //create a team object and fill it in
    const team = new Team('Talons');
    team.addPlayer('Dylan');
    team.addPlayer('Tyler');
    team.assignCoach('Will');
    team.assignManager('Zoe');
    team.assignLogo('Talon.png');
    team.assignRecord(1,1,5);
    team.assignSchedule(['Tigers','Bears']);
    try {
      // Create a new team
      const record = new Record({win: team.record.get('Wins'),tie: team.record.get('Ties'),loss: team.record.get('Losses')});
      const newTeam = new BaseballTeam({ name:team.name,players:team.players,coach:team.coach,manager:team.manager,logo:team.logo,record: record,schedule:team.schedule});
      await newTeam.save();
      console.log("Team saved:", newTeam.toObject());

      // Update a team
      await BaseballTeam.updateOne({ name: 'Talons' }, { coach: "Julio" });
      console.log("Team updated");
  
      // Find all teams
      const teams = await BaseballTeam.find();
      console.log("All teams:", teams.map(t => t.toObject()));
  
      
      // Delete a team
      await BaseballTeam.deleteOne({ name: "Talons" });
      console.log("Team deleted");

      
    } catch (err) {
      console.error("Error:", err);
    } finally {
      mongoose.connection.close();
    }
}
  
run();


  
