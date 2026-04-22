const { sendResponse } = require("../utils/apiResponse");
const userService = require("../services/user.service");

const approveUser = async (req, res, next) => {
    try {
        const user = await userService.approveUserService(req.params.id, req.user.role);
        return sendResponse(res, 200, true, "User approved successfully", { user });
    } catch (error) {
        next(error);
    }
};

const getPendingUsers = async (req, res, next) => {
    try {
        const users = await userService.getPendingUsersService();
        return sendResponse(res, 200, true, "Pending users fetched", { users });
    } catch (error) {
        next(error);
    }
};

const rejectUser = async (req, res, next) => {
    try {
        const user = await userService.rejectUserService(req.params.id);
        return sendResponse(res, 200, true, "User rejected", { user });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsersService(req.query.role);
        return sendResponse(res, 200, true, "Users fetched", { users });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const user = await userService.updateUserStatusService(req.params.id, req.body.status);
        return sendResponse(res, 200, true, `User status updated to ${req.body.status}`, { user });
    } catch (error) {
        next(error);
    }
};

module.exports = { approveUser, rejectUser, getPendingUsers, getAllUsers, updateUserStatus };
