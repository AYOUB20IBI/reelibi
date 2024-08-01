const mongoose = require("mongoose");

const CommentModel = new mongoose.Schema({
    comment: String,
    post_id: String,
    user_id: String,
    date: {type: Date, default: Date.now},
    like:{type: Number,default:0}
},{
    timestamps: true
})

module.exports = mongoose.model("Comment", CommentModel);