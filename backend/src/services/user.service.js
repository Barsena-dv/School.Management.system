const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { createNotification } = require("../controllers/notification.controller");

const approveUserService = async (userId, approverRole) => {
    const target = await User.findById(userId);
    if (!target) throw new AppError("User not found", 404);
    if (target.role === "admin") throw new AppError("Cannot approve admin users", 403);

    if (target.role === "teacher" && approverRole !== "admin")
        throw new AppError("Only admins can approve teachers", 403);
    if (target.role === "student" && approverRole !== "admin" && approverRole !== "teacher")
        throw new AppError("Only admins or teachers can approve students", 403);

    target.status = "approved";
    await target.save();

    await createNotification(
        target._id,
        "Account Approved",
        "Your account has been approved. You can now access the system.",
        "approval"
    );

    const { password: _, ...userWithoutPassword } = target.toObject();
    return userWithoutPassword;
};

const getPendingUsersService = async () => {
    return await User.find({ status: "pending", role: { $ne: "admin" } })
        .select("-password")
        .sort({ createdAt: -1 });
};

const rejectUserService = async (userId) => {
    const target = await User.findById(userId);
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
    return userWithoutPassword;
};

const getAllUsersService = async (roleFilter) => {
    const filter = {};
    if (roleFilter) filter.role = roleFilter;
    return await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 });
};

const updateUserStatusService = async (userId, newStatus) => {
    const target = await User.findById(userId);
    if (!target) throw new AppError("User not found", 404);
    if (target.role === "admin") throw new AppError("Cannot change status of admin users", 403);

    target.status = newStatus;
    await target.save();

    const { password: _, ...userWithoutPassword } = target.toObject();
    return userWithoutPassword;
};

module.exports = {
    approveUserService,
    getPendingUsersService,
    rejectUserService,
    getAllUsersService,
    updateUserStatusService,
};
