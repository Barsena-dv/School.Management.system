const express = require("express");
const { createAssessment, getAssessmentsBySubject, getAllAssessments } = require("../controllers/assessment.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Create assessment (teacher only)
router.post("/", verifyToken, authorizeRoles("teacher"), createAssessment);

// Get all assessments (admin)
router.get("/", verifyToken, authorizeRoles("admin"), getAllAssessments);

// Get assessments by subject
router.get("/subject/:subjectId", verifyToken, authorizeRoles("admin", "teacher", "student"), getAssessmentsBySubject);

module.exports = router;