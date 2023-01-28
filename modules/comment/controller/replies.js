const postModel = require("../../../Database/model/Post");
const HttpError = require("../../../util/HttpError");

const { roles } = require("../../../Middleware/authentication");

const addReply = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const { text } = request.body;
        const createdBy = request.userInfo.id;
        const newPost = await postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId },
            { $push: { "comments.$.replies": { text, createdBy } } },
            { new: true })
        if (!newPost) {
            throw new HttpError(400, "invalid postId")
        }
        response.status(201).json({ message: "reply is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updateReply = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const { text } = request.body;
        const userId = request.userInfo.id;
        const foundPost = await postModel.findOne({
            _id: postId,
            "comments._id": commentId,
            "comments.replies._id": replyId
        })
            .select("comments");
        if (!foundPost) {
            throw new HttpError(400, "invalid post,comment or reply ID")
        }
        const foundComment = foundPost.comments.find(comment => comment._id.toString() === commentId.toString())
        const foundReply = foundComment.replies.find(reply => reply._id.toString() === replyId.toString())
        if (foundReply.createdBy.toString() !== userId.toString()) {
            throw new HttpError(401, "you don't have authority to edit this reply")
        }
        const updatedPost = await postModel.findOneAndUpdate({ _id: postId },
            { $set: { "comments.$[comment].replies.$[reply].text": text } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteReply = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        if (request.userInfo.role !== roles.admin) {
            const foundPost = await postModel.findOne({
                _id: postId,
                "comments._id": commentId,
                "comments.replies._id": replyId
            })
                .select("comments");
            if (!foundPost) {
                throw new HttpError(400, "invalid post,comment or reply ID")
            }
            console.log(foundPost)
            const foundComment = foundPost.comments.find(comment => comment._id.toString() === commentId.toString())
            const foundReply = foundComment.replies.find(reply => reply._id.toString() === replyId.toString())
            if (foundReply.createdBy.toString() !== userId.toString()) {
                throw new HttpError(401, "you don't have authority to delete this reply")
            }
        }

        //permenant delete from Database
        // const updatedPost=await postModel.findByIdAndUpdate(postId,
        //     {$pull:{"comments.$[comment].replies":{_id:replyId}}},
        //     { arrayFilters: [{ "comment._id": commentId }] })

        //soft delete
        const updatedPost = await postModel.findOneAndUpdate({
            _id: postId,
            "comments._id": commentId,
            "comments.replies._id": replyId
        },
            {
                $set: {
                    "comments.$[comment].replies.$[reply].isDeleted": true,
                    "comments.$[comment].replies.$[reply].deletedBy": userId
                }
            },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        response.status(201).json({ message: "Comment is deleted Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = { addReply, updateReply, deleteReply };