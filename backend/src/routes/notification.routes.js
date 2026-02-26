const express = require("express");
const { getMyNotifications, markAsRead, getUnreadCount } = require("../controllers/notification.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication only — no role restriction
router.get("/", verifyToken, getMyNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);  // must be before /:id/read
router.put("/:id/read", verifyToken, markAsRead);

module.exports = router;

