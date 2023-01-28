const router = require("express").Router();

const validation = require("../../Middleware/validation");
const updateUserInfo = require("./controller/updateUserInfo");
const { authentication, roles } = require("../../Middleware/authentication");
const { editProfileValidationSchema, 
        displayProfileValidationSchema, 
        updatePasswordSchema,
        followingValidationSchema } = require("./user.validationSchema");
const displayUserProfile = require("./controller/displayUserProfile");
const updateProfileImage = require("./controller/updateProfileImage");
const updateCoverImages = require("./controller/updateCoverImages");
const updatePassword = require("./controller/updatePAssword");
const { addFollowUser, removeFollowUser } = require("./controller/following");
const { multerUpload, multerValidFileTypes } = require("../../Services/multerUpload");

const editUserRoles = [roles.admin, roles.hr, roles.user];
const displayUserRoles = [roles.admin, roles.hr, roles.user];

const storeProfileImage = multerUpload(multerValidFileTypes.image, "upload/profileImages/").single("profileImage");
const storecoverImages=multerUpload(multerValidFileTypes.image,"upload/coverImages/").array("coverImages",5);

router.patch("/edit-my-information/", authentication(editUserRoles), storeProfileImage, validation(editProfileValidationSchema), updateUserInfo);
router.patch("/change-profile-picture/", authentication(editUserRoles),storeProfileImage, updateProfileImage);
router.patch("/change-cover-pictures/", authentication(editUserRoles), storecoverImages, updateCoverImages);
router.patch("/change-password/", authentication(editUserRoles), validation(updatePasswordSchema), updatePassword);
router.patch("/add-follow/:followedId", authentication(editUserRoles), validation(followingValidationSchema), addFollowUser);
router.patch("/remove-follow/:followedId", authentication(editUserRoles), validation(followingValidationSchema), removeFollowUser);
router.get("/show-profile/:id", authentication(displayUserRoles), validation(displayProfileValidationSchema), displayUserProfile);

module.exports = router;