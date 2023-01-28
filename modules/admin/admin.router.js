// @ts-nocheck
const router=require("express").Router();

const validation=require("../../Middleware/validation");
const {changeRoleValidationSchema,blockingUserValidationSchema}= require("./admin.validation");
const { authentication, roles } = require("../../Middleware/authentication");
const { ChangeRole, BlockUser, displayAllUsers } = require("./controller/users");

const adminRole=[roles.admin]
router.get("/show-all-users",authentication(adminRole),displayAllUsers)
router.patch("/blocking-user/:userId",authentication(adminRole),validation(blockingUserValidationSchema),BlockUser)
router.patch("/change-role/:userId",authentication(adminRole),validation(changeRoleValidationSchema),ChangeRole)

module.exports=router;