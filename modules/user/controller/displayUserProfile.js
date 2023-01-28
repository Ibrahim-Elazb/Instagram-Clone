const QRCode = require('qrcode')

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const displayUserProfile = (request, response, next) => {
    const id = request.params.id;
    userModel.findById(id).select("-_id -password -role -confirmEmail -createdAt -updatedAt -__v").then(user => {
        if (user) {
            if (user.profilePicture) {
                user.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${user.profilePicture}`
            }
            if (user.coverPictures.length > 0) {
                for (let index = 0; index < user.coverPictures.length; index++) {
                    user.coverPictures[index] = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/cover-img/${user.coverPictures[index]}`

                }
            }

            QRCode.toDataURL(`${request.protocol}://${request.hostname}:${process.env.PORT}/api/users/show-profile/${id}`)
                .then(url => {
                    user.qrcodeUrl=url;
                    console.log(url)
                })
                .catch(err => {
                    console.error(err)
                })
                .finally(response.status(200).json({ user }))

        } else {
            next(new HttpError(400, "Not found user"));
        }
    }).catch(error => {
        next(new HttpError(500, "An Error Occured On server"))
    })
}

module.exports = displayUserProfile;