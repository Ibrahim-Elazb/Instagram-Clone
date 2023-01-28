const fs = require("fs")
const path = require("path")

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const updateProfileImage = (request, response, next) => {
        if (request.file) {
            const userId = request.userInfo.id;
            const profilePicture = request.file?.filename;
            userModel.findByIdAndUpdate(userId, { profilePicture })
                .then(preUpdatedUser => {
                    if (preUpdatedUser) {
                        if (profilePicture) {
                            fs.unlink(path.join(__dirname, "../../../upload/profileImages/" + preUpdatedUser.profilePicture), (error) => {
                                if (error) {
                                    console.log("Error occurred during file delete: " + error)
                                } else {
                                    console.log("old profile image was deleted")
                                }
                            })
                            response.status(201).json({ message: "successful changed profile image" })
                        }
                    } else {
                        response.status(403).json({ message: "Unable to update this profile Information" })
                    }
                }).catch(error => {
                    console.log("Error Occured: ")
                    console.log(error)
                    next(new HttpError(500, error.message||"An Error Occured On server"))
                })
        }else{
            response.status(400).json({ message: "No Profile Picture is added" })
        }
}

module.exports = updateProfileImage;