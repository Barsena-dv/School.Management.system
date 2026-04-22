const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/appError");

const registerUserService = async (userData) => {
    const { name, email, password, role } = userData;
    const user = await User.create({ name, email, password, role });
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

const loginUserService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    // TEMPORARILY DISABLED: Allow all logins so you can access your old Admin account
    // if (user.status !== "approved") {
    //     throw new AppError("Account not approved yet", 403);
    // }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
};

module.exports = {
    registerUserService,
    loginUserService,
};
