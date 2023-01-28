// @ts-nocheck
const mongoose = require("mongoose");
const DBschema = mongoose.Schema;
const commentSchema = require("./Comment");

const postSchema = new DBschema({
    text: DBschema.Types.String,
    images: {
        type: DBschema.Types.Array,
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
    share: [{
        type: DBschema.Types.ObjectId,
        ref: "User"
    }],
    comments: [commentSchema],
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
});


const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;