const express = require("express");
const { addMark, getMarksByAssessment, getMarksByStudent, getMyMarks } = require("../controllers/mark.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("teacher"), addMark);
router.get("/me", verifyToken, authorizeRoles("student"), getMyMarks);
router.get("/assessment/:assessmentId", verifyToken, authorizeRoles("admin", "teacher"), getMarksByAssessment);
router.get("/student/:studentId", verifyToken, authorizeRoles("admin", "teacher", "student"), getMarksByStudent);

module.exports = router;
