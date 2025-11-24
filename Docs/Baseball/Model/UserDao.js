const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type : String, required: true, unique: true},
    password: {type : String, required: true},
    email: {type : String, required: true},
    phone: {type : String, required: false},
    permission: {type : Number, required: false},
    name: {type : String, required: false},
    rating: {type : Number, required: false},
    role: {type : String, enum: ["coach", "manager", "admin", "player", "child"], default : "player", required: false},
    team: {type : mongoose.Schema.Types.ObjectId, ref: "Team", required: false},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
    timeCreated: {type : Date, default: Date.now}
})

const userModel = mongoose.model('User', userSchema);

exports.create = async function(newUser) {
    const user = new userModel(newUser);
    await user.save();
    return user;
}

exports.createChild = async function(parentId, childData) {
    const data = Object.assign({}, childData, { role: 'child' });
    data.parent = parentId;

    const child = new userModel(data);
    await child.save();
    return child;
}

exports.read = async function(id) {
    const user = await userModel.findById(id);
    return user;
}

exports.readAll = async function() {
    const users = await userModel.find();
    return users;
}

exports.readByUsername = async function(username) {
    const user = await userModel.findOne({username});
    return user;
}

exports.readByName = async function(userName) {
    const user = await userModel.findOne({name : userName});
    return user;
}

exports.delete = async function(username) {
    const user = await userModel.findOneAndDelete(username);
    return user;
}

exports.deleteAll = async function() {
    return await userModel.deleteMany();
}

exports.updateByUsername = async function (username, updateData) {
  return await userModel.findOneAndUpdate(
    { username },
    { $set: updateData },
    { new: true } // Return the updated document
  );
};

