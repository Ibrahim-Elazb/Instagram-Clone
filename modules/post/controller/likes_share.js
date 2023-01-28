const postModel = require("../../../Database/model/Post");
const HttpError = require("../../../util/HttpError");

const likePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const userId = request.userInfo.id;
        const likedPost = await postModel.findByIdAndUpdate(postId, { $push: { likes: userId } })
        if(!likedPost){
            throw new HttpError(400,"invalid post id")
        }
        response.status(201).json({ message: "like is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unLikePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const userId = request.userInfo.id;
        const unLikedPost = await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } })
        if(!unLikedPost){
            throw new HttpError(400,"invalid post id")
        }
        response.status(201).json({ message: "like is Removed Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const sharePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const userId = request.userInfo.id;
        const sharedPost = await postModel.findByIdAndUpdate(postId, { $push: { share: userId } })
        if(!sharedPost){
            throw new HttpError(400,"invalid post id")
        }
        response.status(201).json({ message: "post is shared Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unSharePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const userId = request.userInfo.id;
        const unSharePost = await postModel.findByIdAndUpdate(postId, { $pull: { share: userId } })
        if(!unSharePost){
            throw new HttpError(400,"invalid post id")
        }
        response.status(201).json({ message: "share is Removed Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}


module.exports = { likePost, unLikePost, sharePost, unSharePost };