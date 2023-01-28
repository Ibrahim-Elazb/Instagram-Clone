const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const addFollowUser = async (request, response, next) => {
    const followingId = request.userInfo.id;
    const followedId= request.params.followedId;
    try {
        if(followingId.toString()===followedId.toString())
            throw new HttpError(400, "unable to follow yourself :)");
        const followedUser = await userModel.findByIdAndUpdate(followedId, 
                                                            {$push:{followers:followingId}  }, 
                                                            { new: true });
        if(!followedUser) 
            throw new HttpError(400, "Not Exist User");
        const followingUser = await userModel.findByIdAndUpdate(followingId, 
                                                            {$push:{following:followedId}  }, 
                                                            { new: true });
            
        response.status(201).json(`${followingUser.userName} is following ${followedUser.userName}`)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

const removeFollowUser = async (request, response, next) => {
    const followingId = request.userInfo.id;
    const followedId= request.params.followedId;
    try {
        if(followingId.toString()===followedId.toString())
            throw new HttpError(400, "unable to unfollow yourself :)");
        const followedUser = await userModel.findByIdAndUpdate(followedId, 
                                                            {$pull:{followers:followingId}  }, 
                                                            { new: true });
        if(!followedUser) 
            throw new HttpError(400, "Not Exist User");
        const followingUser = await userModel.findByIdAndUpdate(followingId, 
                                                            {$pull:{following:followedId}  }, 
                                                            { new: true });
            
        response.status(201).json(`${followingUser.userName}  is unfollowing ${followedUser.userName}`)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

module.exports={addFollowUser,removeFollowUser}