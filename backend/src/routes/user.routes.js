const express = require("express");
const { approveUser, rejectUser, getPendingUsers, getAllUsers, updateUserStatus } = require("../controllers/user.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { userIdValidation, updateStatusValidation, queryRoleValidation } = require("../validations/user.validation");

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), validate(queryRoleValidation), getAllUsers);
router.get("/pending", verifyToken, authorizeRoles("admin"), getPendingUsers);
router.patch("/:id/approve", verifyToken, authorizeRoles("admin"), validate(userIdValidation), approveUser);
router.patch("/:id/reject", verifyToken, authorizeRoles("admin"), validate(userIdValidation), rejectUser);
router.patch("/:id/status", verifyToken, authorizeRoles("admin"), validate(updateStatusValidation), updateUserStatus);

module.exports = router;
