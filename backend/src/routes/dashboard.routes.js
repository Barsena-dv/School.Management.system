const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
// const { getStudentDashboard } = require("../controllers/dashboard.controller");


// GET /api/dashboard/student
// Protected: Only student role allowed
router.get(
    "/student",
    verifyToken,
    authorizeRoles("student"),
    dashboardController.getStudentDashboard
);

module.exports = router;
