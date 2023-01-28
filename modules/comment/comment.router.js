const router = require("express").Router();
const { roles, authentication } = require("../../Middleware/authentication");
const validation = require("../../Middleware/validation");
const { newCommentValidationSchema,
    likeCommentValidationSchema,
    editCommentValidationSchema,
    newReplyValidationSchema,
    editReplyValidationSchema,
    likeReplyValidationSchema } = require("./comment.validatioSchema");
const { addComment, deleteComment, updateComment } = require("./controller/comments");
const { likeComment, unLikeComment, likeReply, unLikeReply } = require("./controller/likes");
const { addReply, updateReply, deleteReply } = require("./controller/replies");

const addPostRoles = [roles.user, roles.admin];
const displayUserRoles = [roles.admin, roles.hr, roles.user];

router.post("/:postId/add-comment", authentication(addPostRoles), validation(newCommentValidationSchema), addComment)
router.delete("/:postId/delete-comment/:commentId", authentication(addPostRoles), validation(likeCommentValidationSchema), deleteComment)
router.patch("/:postId/edit-comment/:commentId", authentication(addPostRoles), validation(editCommentValidationSchema), updateComment)
router.patch("/:postId/:commentId/add-like", authentication(addPostRoles), validation(likeCommentValidationSchema), likeComment)
router.patch("/:postId/:commentId/remove-like", authentication(addPostRoles), validation(likeCommentValidationSchema), unLikeComment)

router.post("/:postId/:commentId/add-reply", authentication(addPostRoles), validation(newReplyValidationSchema), addReply)
router.patch("/:postId/:commentId/edit-reply/:replyId", authentication(addPostRoles), validation(editReplyValidationSchema), updateReply)
router.delete("/:postId/:commentId/delete-reply/:replyId", authentication(addPostRoles), validation(likeReplyValidationSchema), deleteReply)
router.patch("/:postId/:commentId/:replyId/add-like", authentication(addPostRoles), validation(likeReplyValidationSchema), likeReply)
router.patch("/:postId/:commentId/:replyId/remove-like", authentication(addPostRoles), validation(likeReplyValidationSchema), unLikeReply)

module.exports = router
