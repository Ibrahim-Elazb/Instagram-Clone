const { authentication, roles } = require("../../Middleware/authentication");
const validation = require("../../Middleware/validation");
const { multerUpload, multerValidFileTypes } = require("../../Services/multerUpload");
const { addPost, updatePost, deletePost, displayPostById, displayPosts } = require("./controller/Posts");
const { likePost, unLikePost, sharePost, unSharePost} = require("./controller/likes_share");
const { newPostValidationSchema, editPostValidationSchema, findPostValidationSchema} = require("./post.validatioSchema");

const router = require("express").Router();
const addPostRoles = [roles.user];
const updatePostRoles = [roles.user];
const deletePostRoles = [roles.user, roles.admin];
const likePostRoles = [roles.user];
const unlikePostRoles = [roles.user];
const sharePostRoles = [roles.user];
const unsharePostRoles = [roles.user];
const displayUserRoles = [roles.admin, roles.hr, roles.user];

const postImages = multerUpload(multerValidFileTypes.image, "upload/postImages/").array("images", 10);
// Add New Post
router.post("/add-post", authentication(addPostRoles), postImages, validation(newPostValidationSchema), addPost);
router.patch("/edit-post/:postId", authentication(updatePostRoles), validation(editPostValidationSchema), updatePost);
router.delete("/remove-post/:postId", authentication(deletePostRoles), validation(newPostValidationSchema), deletePost);
router.patch("/:postId/add-like", authentication(likePostRoles), validation(findPostValidationSchema), likePost)
router.patch("/:postId/remove-like", authentication(unlikePostRoles), validation(findPostValidationSchema), unLikePost)
router.patch("/:postId/share", authentication(sharePostRoles), validation(findPostValidationSchema), sharePost)
router.patch("/:postId/unshare", authentication(unsharePostRoles), validation(findPostValidationSchema), unSharePost)

router.get("/:postId", authentication(displayUserRoles),validation(newPostValidationSchema), displayPostById);
router.get("/", authentication(displayUserRoles), displayPosts)


module.exports = router;