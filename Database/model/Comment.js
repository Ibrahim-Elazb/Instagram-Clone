// @ts-nocheck
const mongoose = require("mongoose");
const replyOfCommentSchema = require("./ReplyOfComment");
const DBschema = mongoose.Schema;

const commentSchema = new DBschema({
    text: {
        type: DBschema.Types.String,
        required: true
    },
    createdBy: {
        type: DBschema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: DBschema.Types.ObjectId,
        ref: "User"
    }],
    replies:[replyOfCommentSchema],
    isDeleted: {
        type: DBschema.Types.Boolean,
        default: false
    },
    deletedBy: {
        type: DBschema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})


module.exports=commentSchema;