import mongoose from 'mongoose';
import { Team } from './team.js';

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

async function save(doc) {
  try {
    await doc.save();
    console.log("Team saved:", doc.toObject());
  } catch (err) {
    console.error("Error:", err);
  }
}

async function del(model, filter) {
  try {
    await model.deleteOne(filter);
    console.log("Team deleted");
  } catch (err) {
    console.error("Error:", err);
  }
}

async function findAll(model) {
    try {
      const docs = await model.find();
      console.log("All teams:");
      console.log(docs.map((d) => d.toObject()));
      return docs;
    } catch (err) {
      console.error("Find error:", err);
    }
  }
  
  // UPDATE
  async function update(model, filter, updateData) {
    try {
      const result = await model.updateOne(filter, updateData);
      if (result.modifiedCount > 0) {
        console.log(" Team updated:", filter, "->", updateData);
      } else {
        console.log("⚠️ No matching document found for update.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  }

async function run() {
  try {
    await mongoose.connect(
      'mongodb+srv://dpmorales777_db_user:pCkylHNN2NfyUT5G@cluster0.grq5znw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log("Connected to MongoDB with Mongoose");

    const team = new Team('Talons');
    team.addPlayer('Dylan');
    team.addPlayer('Tyler');
    team.assignCoach('Will');
    team.assignManager('Zoe');
    team.assignLogo('Talon.png');
    team.assignRecord(1, 1, 5);
    team.assignSchedule(['Tigers', 'Bears']);

    const BaseballTeam = mongoose.model('Team', teamSchema);
    const Record = mongoose.model('Record', recordSchema);

    const record = new Record({
        win: team.record.get('Wins'),
        tie: team.record.get('Ties'),
        loss: team.record.get('Losses')
    });

    const newTeam = new BaseballTeam({
        name: team.name,
        players: team.players,
        coach: team.coach,
        manager: team.manager,
        logo: team.logo,
        record: record,
        schedule: team.schedule
    });

    await save(newTeam);
    await update(BaseballTeam, {name: 'Talons'}, {coach: 'Julio'})
    await findAll(BaseballTeam);
    await del(BaseballTeam, { name: 'Talons' });
    

  } catch (err) {
    console.error("Connection or Operation Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
  }
}

run();