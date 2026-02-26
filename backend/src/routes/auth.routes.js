const express = require("express");
const { body, validationResult } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, handleValidationErrors, registerUser);
router.post("/login", loginValidation, handleValidationErrors, loginUser);

router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
});

router.get("/admin-test", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({ message: "Admin access granted", user: req.user });
});

module.exports = router;
