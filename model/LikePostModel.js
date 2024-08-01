const mongoose = require("mongoose");

const LikePostModel = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    like: { type: Boolean, default: true } 
}, {
    timestamps: true 
});

module.exports = mongoose.model("LikePost", LikePostModel);
