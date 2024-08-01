
const mongoose = require("mongoose");

const PostModel = new mongoose.Schema({
    title: String,
    description: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    video: String,
    like: {type: Number,default:0}
}, {
    timestamps: true 
});

module.exports = mongoose.model("Post", PostModel);

