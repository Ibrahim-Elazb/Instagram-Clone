const userModel = require("../../../Database/model/User");
const { roles } = require("../../../Middleware/authentication");
const HttpError = require("../../../util/HttpError");


const displayAllUsers = async (request, response, next) => {
    try {
        const users = await userModel.find({}).select("-_id -password -confirmEmail -createdAt -updatedAt -__v")
        if (users.length === 0) {
            return response.status(200).json([]);
        }
        users.map(user => {
            if (user.profilePicture) {
                user.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${user.profilePicture}`
            }
            if (user.coverPictures.length > 0) {
                for (let index = 0; index < user.coverPictures.length; index++) {
                    user.coverPictures[index] = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/cover-img/${user.coverPictures[index]}`
                }
            }
        })
        response.status(200).json(users)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}


const ChangeRole = async (request, response, next) => {
    const updatedId = request.params.userId;
    const { role } = request.body;
    try {
        if (request.userInfo.role !== roles.admin)
            throw new HttpError(401, "You don't have authority to update role of this user");
        const updatedUser = await userModel.findByIdAndUpdate(updatedId, { role }, { new: true });
        if (!updatedUser)
            throw new HttpError(400, "Not Exist User");
        response.status(201).json("user role is updated")
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

const BlockUser = async (request, response, next) => {
    const updatedId = request.params.userId;
    const { isBlocked } = request.body;
    try {
        if (request.userInfo.role !== roles.admin)
            throw new HttpError(401, "You don't have authority to update role of this user");
        const updatedUser = await userModel.findByIdAndUpdate(updatedId, { isBlocked }, { new: true });
        if (!updatedUser)
            throw new HttpError(400, "Not Exist User");
        response.status(201).json(isBlocked ? `${updatedUser.userName} is Blocked` : `${updatedUser.userName} is UnBlocked`)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

module.exports = { ChangeRole, BlockUser, displayAllUsers };