const jwt = require("jsonwebtoken");

const postModel = require("../../../Database/model/Post");
const { roles } = require("../../../Middleware/authentication");
const HttpError = require("../../../util/HttpError");

const addPost = async (request, response, next) => {
    try {
        const { text } = request.body;
        const createdBy = request.userInfo.id;
        if (request.files?.length === 0) {
            throw new HttpError(400, "You have to add Images in your post")
        }
        const images = request.files.map(item => item.filename);
        const newPost = new postModel({ text, createdBy, images });
        const createdPost = await newPost.save();
        // console.log(createdPost);
        response.status(201).json({ message: "post is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updatePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const { text } = request.body;
        const userId = request.userInfo.id;
        const foundPost = await postModel.findById(postId)
        if (!foundPost) { throw new HttpError(400, "invalid Post ID") }
        if (foundPost.createdBy.toString() === userId.toString()) {
            const updatedPost = await postModel.findByIdAndUpdate(postId, { text }, { new: true })
            // console.log(updatedPost)
            response.status(201).json({ message: "post is updated Successfully" })
        } else {
            response.status(401).json({ message: "You don't have authority to edit that post" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deletePost = async (request, response, next) => {
    try {
        const postId = request.params.postId;
        const userId = request.userInfo.id;
        const foundPost = await postModel.findById(postId);
        if (foundPost.createdBy.toString() === userId.toString() || request.userInfo.role === roles.admin) {
            foundPost.isDeleted = true; //soft delete
            foundPost.deletedBy = userId;
            const deletedPost = await foundPost.save();
            // const deletedPost = await postModel.findByIdAndDelete(postId); //To Delete Permenantly
            response.status(201).json({ message: "post is deleted Successfully" })
        } else {
            response.status(401).json({ message: "You aren't Authorized to delete that post" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const displayPostById = (request, response, next) => {
    const postId = request.params.postId;
    postModel.findById(postId)
        .select("_id text images createdBy comments")
        .populate([{ path: "createdBy", select: "_id userName profilePicture" },
        {
            path: "comments", select: "text createdBy replies", populate: [{ path: "createdBy", select: "_id userName profilePicture" },
            { path: "replies", select: "text createdBy", populate: { path: "createdBy", select: "_id userName profilePicture" } }]
        }]).then(foundPost => {
            if (foundPost) {
                foundPost.images = foundPost.images.map(image => `${request.protocol}://${request.hostname}:${process.env.PORT}/api/post-img/${image}`)
                foundPost.createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${foundPost.createdBy.profilePicture}`
                for (let index = 0; index < foundPost.comments.length; index++) {
                    foundPost.comments[index].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${foundPost.comments[index].createdBy.profilePicture}`
                    
                }
                console.log(foundPost.comments.length)
                response.status(200).json({ foundPost })
            } else {
                next(new HttpError(400, "This Post isn't exist"));
            }
        }).catch(error => {
            next(new HttpError(500, "An Error Occured On server"))
        })
}

const displayPosts = (request, response, next) => {
    postModel.find().select("_id text images createdBy comments")
        .populate([{ path: "createdBy", select: "_id userName profilePicture comments" },
        {
            path: "comments", select: "text createdBy replies", populate: [{ path: "createdBy", select: "_id userName profilePicture" },
            { path: "replies", select: "text createdBy", populate: { path: "createdBy", select: "_id userName profilePicture" } }]
        }])
        .then(posts => {
            if (posts.length > 0) {
                for (let index = 0; index < posts.length; index++) {
                    posts[index].images = posts[index].images.map(image => `${request.protocol}://${request.hostname}:${process.env.PORT}/api/post-img/${image}`)
                    posts[index].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${posts[index].createdBy.profilePicture}`
                }
                response.status(200).json({ posts })
            } else {
                next(new HttpError(200, "No Posts"));
            }
        }).catch(error => {
            console.log(error)
            next(new HttpError(500, "An Error Occured On server"))
        })
}

module.exports = { addPost, updatePost, deletePost, displayPostById, displayPosts };