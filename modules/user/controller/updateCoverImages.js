const fs = require("fs")
const path = require("path")

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const updateCoverImages = (request, response, next) => {
    if (request.files?.length > 0) {
        const userId = request.userInfo.id;
        const coverPictures = request.files.map(file => file.filename);
        userModel.findByIdAndUpdate(userId, { coverPictures })
            .then(preUpdatedUser => {
                if (preUpdatedUser) {
                    if (coverPictures.length > 0) {
                        for (let index = 0; index < preUpdatedUser.coverPictures.length; index++) {
                            fs.unlink(path.join(__dirname, "../../../upload/coverImages/" + preUpdatedUser.coverPictures[index]), (error) => {
                                if (error) {
                                    console.log("Error occurred during file delete: " + error)
                                } else {
                                    console.log("old profile image was deleted")
                                }
                            })
                        }
                        response.status(201).json({ message: "successful changed cover images" })
                    }
                } else {
                    response.status(403).json({ message: "Unable to update this profile Information" })
                }
            }).catch(error => {
                console.log("Error Occured: ")
                console.log(error)
                next(new HttpError(500, "An Error Occured On server"))
            })
    }else{
        response.status(400).json({ message: "No Cover Pictures is added" })
    }
}

module.exports = updateCoverImages;