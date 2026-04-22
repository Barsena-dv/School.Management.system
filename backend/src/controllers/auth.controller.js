const { sendResponse } = require("../utils/apiResponse");
const authService = require("../services/auth.service");

const registerUser = async (req, res, next) => {
    try {
        const userWithoutPassword = await authService.registerUserService(req.body);
        return sendResponse(res, 201, true, "User registered successfully", { user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUserService(email, password);
        return sendResponse(res, 200, true, "Login successful", result);
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };
