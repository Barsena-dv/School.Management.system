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

module.exports = { approveUser };
