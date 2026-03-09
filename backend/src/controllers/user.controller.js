const User = require("../models/user.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { createNotification } = require("./notification.controller");

const approveUser = async (req, res, next) => {
    try {
        const target = await User.findById(req.params.id);
        if (!target) throw new AppError("User not found", 404);
        if (target.role === "admin") throw new AppError("Cannot approve admin users", 403);

        const approverRole = req.user.role;
        if (target.role === "teacher" && approverRole !== "admin")
            throw new AppError("Only admins can approve teachers", 403);
        if (target.role === "student" && approverRole !== "admin" && approverRole !== "teacher")
            throw new AppError("Only admins or teachers can approve students", 403);

        target.status = "approved";
        await target.save();

        // Notify the approved user (non-blocking)
        await createNotification(
            target._id,
            "Account Approved",
            "Your account has been approved. You can now access the system.",
            "approval"
        );

        const { password: _, ...userWithoutPassword } = target.toObject();
        return sendResponse(res, 200, true, "User approved successfully", { user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

const getPendingUsers = async (req, res, next) => {
    try {
        const users = await User.find({ status: "pending", role: { $ne: "admin" } })
            .select("-password")
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, true, "Pending users fetched", { users });
    } catch (error) {
        next(error);
    }
};

const rejectUser = async (req, res, next) => {
    try {
        const target = await User.findById(req.params.id);
        if (!target) throw new AppError("User not found", 404);
        if (target.role === "admin") throw new AppError("Cannot reject admin users", 403);

        target.status = "rejected";
        await target.save();

        await createNotification(
            target._id,
            "Account Rejected",
            "Your account registration has been rejected. Please contact support.",
            "approval"
        );

        const { password: _, ...userWithoutPassword } = target.toObject();
        return sendResponse(res, 200, true, "User rejected", { user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, true, "Users fetched", { users });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ["approved", "suspended", "rejected", "pending"];
        if (!allowed.includes(status)) throw new AppError("Invalid status value", 400);

        const target = await User.findById(req.params.id);
        if (!target) throw new AppError("User not found", 404);
        if (target.role === "admin") throw new AppError("Cannot change status of admin users", 403);

        target.status = status;
        await target.save();

        const { password: _, ...userWithoutPassword } = target.toObject();
        return sendResponse(res, 200, true, `User status updated to ${status}`, { user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

module.exports = { approveUser, rejectUser, getPendingUsers, getAllUsers, updateUserStatus };

