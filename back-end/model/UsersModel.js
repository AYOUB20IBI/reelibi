
const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    image: String,
    bio: String,
    gender: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true 
});

module.exports = mongoose.model("User", User);
