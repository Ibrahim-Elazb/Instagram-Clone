const postModel = require("../../../Database/model/Post");
const HttpError = require("../../../util/HttpError");

const likeComment = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const newPost = await postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId }, { $push: { "comments.$.likes": userId } }, { new: true })
        // console.log(newPost)
        response.status(201).json({ message: "like is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unLikeComment = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const newPost = await postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId }, { $pull: { "comments.$.likes": userId } }, { new: true })
        response.status(201).json({ message: "like is Removed Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const likeReply = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        const updatedPost = await postModel.findOneAndUpdate({ _id: postId },
            { $push: { "comments.$[comment].replies.$[reply].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        if (!updatedPost) {
            throw new HttpError(400, "invalid post,comment or reply ID")
        }
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unLikeReply=async (request,response,next)=>{
    try {
        const postId = request.params.postId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        const updatedPost = await postModel.findOneAndUpdate({ _id: postId },
            { $pull: { "comments.$[comment].replies.$[reply].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        if (!updatedPost) {
            throw new HttpError(400, "invalid post,comment or reply ID")
        }
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}


module.exports = { likeComment, unLikeComment, likeReply, unLikeReply }