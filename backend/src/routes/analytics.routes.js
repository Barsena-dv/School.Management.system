const express = require("express");
const { getStudentAnalytics, getAdminOverview, getTeacherOverview } = require("../controllers/analytics.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/admin/overview", verifyToken, authorizeRoles("admin"), getAdminOverview);
router.get("/teacher/overview", verifyToken, authorizeRoles("teacher"), getTeacherOverview);
router.get("/student/:studentId", verifyToken, authorizeRoles("admin", "teacher", "student"), getStudentAnalytics);

module.exports = router;
