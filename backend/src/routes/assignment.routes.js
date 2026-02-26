const express = require("express");
const { createAssignment, getAssignmentsBySubject, getAllAssignments } = require("../controllers/assignment.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// POST /api/assignments — teacher only
router.post("/", verifyToken, authorizeRoles("teacher"), createAssignment);
router.get("/", verifyToken, authorizeRoles("admin", "teacher", "student"), getAllAssignments);
// GET /api/assignments/subject/:subjectId — admin, teacher, student
router.get("/subject/:subjectId", verifyToken, authorizeRoles("admin", "teacher", "student"), getAssignmentsBySubject);

module.exports = router;
