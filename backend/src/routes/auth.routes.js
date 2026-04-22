const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { registerValidation, loginValidation } = require("../validations/auth.validation");

const router = express.Router();

// Public auth routes
router.post("/register", validate(registerValidation), registerUser);
router.post("/login", validate(loginValidation), loginUser);

// Protected routes (for testing/utils)
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
});

router.get("/admin-test", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({ message: "Admin access granted", user: req.user });
});

module.exports = router;
