import mongoose from 'mongoose';
import { Team } from './team.js';




mongoose.connect('mongodb+srv://dpmorales777_db_user:pCkylHNN2NfyUT5G@cluster0.grq5znw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB with Mongoose"))
.catch(err => console.error("Connection error:", err));

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
    record: recordSchema,
    schedule: [{ type: String }]
  });

const BaseballTeam = mongoose.model('Team', teamSchema);

async function run() {
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
      const newTeam = new BaseballTeam({ name:team.name,players:team.players,coach:team.coach,manager:team.manager,logo:team.logo,record:team.record,schedule:team.schedule});
      await newTeam.save();
      console.log("Team saved:", newTeam.toObject());
  
      // Find all users
      const teams = await BaseballTeam.find();
      console.log("All teams:", teams.map(t => t.toObject()));
  
      // Update a user
      await BaseballTeam.updateOne({ name: 'TALONS' }, { coach: "Julio" });
      console.log("Team updated");
  
      // Delete a user
      await BaseballTeam.deleteOne({ name: "Talons" });
      console.log("User deleted");

      
    } catch (err) {
      console.error("Error:", err);
    } finally {
      mongoose.connection.close();
    }
}
  
run();

