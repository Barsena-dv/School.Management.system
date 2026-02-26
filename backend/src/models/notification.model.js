const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["assignment","assessment", "grade", "approval", "event"],
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index on user for fast per-user notification queries
notificationSchema.index({ user: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
