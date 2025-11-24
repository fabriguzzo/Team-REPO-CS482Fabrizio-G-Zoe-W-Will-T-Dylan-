const mongoose = require('mongoose');


const invitationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: String, required: true }, // username string
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    role: { type: String, enum: ["player", "coach","manager"], required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

const invitationModel = mongoose.model("Invitation", invitationSchema);


exports.create = async function(newInvite) {
  const invite = new invitationModel(newInvite);
  await invite.save();
  return invite;
};


exports.readAll = async function() {
    return await invitationModel.find().populate("recipient team");
};


exports.readByRecipient = async function(userId) {
  return await invitationModel.find({ recipient: userId }).populate("team sender");
};


exports.readByTeam = async function(teamId) {
  return await invitationModel.find({ team: teamId }).populate("recipient sender");
};


exports.updateStatus = async function(inviteId, status) {
  return await invitationModel.findByIdAndUpdate(inviteId, { status }, { new: true });
};


exports.delete = async function(inviteId) {
  return await invitationModel.findByIdAndDelete(inviteId);
};

exports.readByRecipients = async function(ids) {
    return await invitationModel
      .find({ recipient: { $in: ids } })
      .populate("team recipient");
};
  
