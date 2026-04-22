const { body } = require("express-validator");

const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required").isString(),
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["student", "teacher"])
        .withMessage("Invalid role selected"),
];

const loginValidation = [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = {
    registerValidation,
    loginValidation,
};
