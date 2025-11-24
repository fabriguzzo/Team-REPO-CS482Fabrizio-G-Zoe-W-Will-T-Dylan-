const mongoose = require('mongoose');

/* -------------------- USER SCHEMA -------------------- */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  permission: { type: Number },
  name: { type: String },
  rating: { type: Number }, // included from both versions
  role: { 
    type: String, 
    enum: ["coach", "manager", "admin", "player", "child"], 
    default: "player" 
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeCreated: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);

/* -------------------- CREATE -------------------- */
exports.create = async function(newUser) {
  const user = new userModel(newUser);
  await user.save();
  return user;
};

/* -------------------- CREATE CHILD -------------------- */
exports.createChild = async function(parentId, childData) {
  const data = {
    ...childData,
    role: 'child',
    parent: parentId,
    team: null // children are not tied to a team by default
  };

  const child = new userModel(data);
  await child.save();
  return child;
};

/* -------------------- READ -------------------- */
exports.read = async function(id) {
  return await userModel.findById(id);
};

exports.readAll = async function() {
  return await userModel.find();
};

exports.readByUsername = async function(username) {
  return await userModel.findOne({ username });
};

exports.readByName = async function(name) {
  return await userModel.findOne({ name });
};

/* -------------------- DELETE -------------------- */
exports.delete = async function(username) {
  return await userModel.findOneAndDelete({ username });
};

exports.deleteAll = async function() {
  return await userModel.deleteMany();
};

/* -------------------- UPDATE -------------------- */
exports.updateByUsername = async function(username, updateData) {
  return await userModel.findOneAndUpdate(
    { username },
    { $set: updateData },
    { new: true }
  );
};