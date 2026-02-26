const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        const { password: _, ...userWithoutPassword } = user.toObject();
        return sendResponse(res, 201, true, "User registered successfully", { user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw new AppError("Invalid email or password", 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new AppError("Invalid email or password", 401);

        if (user.status !== "approved") throw new AppError("Account not approved yet", 403);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();
        return sendResponse(res, 200, true, "Login successful", { token, user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };
