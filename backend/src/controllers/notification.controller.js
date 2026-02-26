const Notification = require("../models/notification.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

// ─── Utility ────────────────────────────────────────────────────────────────

/**
 * Creates a notification for a user. Safe to call from any controller —
 * failures are caught internally to avoid disrupting the parent request.
 *
 * @param {string} userId
 * @param {string} title
 * @param {string} message
 * @param {"assignment"|"grade"|"approval"|"event"} type
 */
const createNotification = async (userId, title, message, type) => {
    try {
        await Notification.create({ user: userId, title, message, type });
    } catch (err) {
        console.error("Failed to create notification:", err.message);
    }
};

// ─── Handlers ───────────────────────────────────────────────────────────────

// GET /api/notifications
const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        return sendResponse(res, 200, true, "Notifications fetched successfully", { notifications });
    } catch (error) {
        next(error);
    }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) throw new AppError("Notification not found", 404);

        // Users can only mark their own notifications
        if (notification.user.toString() !== req.user.id)
            throw new AppError("Access forbidden", 403);

        notification.read = true;
        await notification.save();

        return sendResponse(res, 200, true, "Notification marked as read", { notification });
    } catch (error) {
        next(error);
    }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res, next) => {
    try {
        const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
        return sendResponse(res, 200, true, "Unread count fetched successfully", { unreadCount });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMyNotifications, markAsRead, getUnreadCount, createNotification };

