import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

//SCHEMAS
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
  schedule: [{ type: String }],
});

const BaseballTeam = mongoose.model("Team", teamSchema);

//DATABASE CONNECTION
async function connectDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://dpmorales777_db_user:pCkylHNN2NfyUT5G@cluster0.grq5znw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(" Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDb();

//ROUTES
app.get("/teams", async (req, res) => {
  try {
    const teams = await BaseballTeam.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

//START SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
