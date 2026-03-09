const express = require("express");
const { approveUser, rejectUser, getPendingUsers, getAllUsers, updateUserStatus } = require("../controllers/user.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Admin: list all users (optional ?role= filter)
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);
// Admin: list all pending users
router.get("/pending", verifyToken, authorizeRoles("admin"), getPendingUsers);
// Admin: approve a user
router.patch("/:id/approve", verifyToken, authorizeRoles("admin"), approveUser);
// Admin: reject a user
router.patch("/:id/reject", verifyToken, authorizeRoles("admin"), rejectUser);
// Admin: update user status (suspend / reactivate)
router.patch("/:id/status", verifyToken, authorizeRoles("admin"), updateUserStatus);

module.exports = router;


