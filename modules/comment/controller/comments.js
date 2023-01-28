const postModel = require("../../../Database/model/Post");
const HttpError = require("../../../util/HttpError");

const { roles } = require("../../../Middleware/authentication");

const addComment = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const { text } = request.body;
        const createdBy = request.userInfo.id;
        const updatedPost = await postModel.findByIdAndUpdate(postId, { $push: { comments: { text, createdBy } } })
        if (!updatedPost) {
            throw new HttpError(400, "Inavlid Post ID")
        }
        response.status(201).json({ message: "Comment is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updateComment = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const { text } = request.body;
        const userId = request.userInfo.id;
        const foundPost = await postModel.findById(postId).select("comments");
        if (!foundPost) {
            throw new HttpError(400, "invalid Post Id")
        }
        const foundComment = foundPost.comments.find(comment => comment._id.toString() === commentId.toString())
        if (!foundComment) {
            throw new HttpError(400, "Invalid Comment To delete")
        }
        if (foundComment.createdBy.toString() !== userId.toString()) {
            throw new HttpError(400, "You don't have authority to delete this comment")
        }
        const newPost = await postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId },
            { $set: { "comments.$.text": text } },
            { new: true })
        // console.log(newPost)
        response.status(201).json({ message: "Comment is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteComment = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const foundPost = await postModel.findById(postId).select("comments");
        if (!foundPost) {
            throw new HttpError(400, "invalid Post Id")
        }
        if (request.userInfo.role !== roles.admin) {
            const foundComment = foundPost.comments.find(comment => comment._id.toString() === commentId.toString())
            if (!foundComment) {
                throw new HttpError(400, "Invalid Comment To delete")
            }
            if (foundComment.createdBy.toString() !== userId.toString()) {
                throw new HttpError(400, "You don't have authority to delete this comment")
            }
        }
        // const newPost=await postModel.findByIdAndUpdate(postId,{$pull:{comments:{_id:commentId}}},{new:true})
        const newPost = await postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId },
            { $set: { "comments.$.isDeleted": true, "comments.$.deletedBy": userId } },
            { new: true })
        response.status(201).json({ message: "Comment is deleted Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = { addComment, updateComment, deleteComment };