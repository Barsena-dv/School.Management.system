const express = require("express");
const router = express.Router();
const studentSubjectController = require("../controllers/studentSubject.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Admin only: Enroll a student
router.post(
    "/enroll",
    verifyToken,
    authorizeRoles("admin"),
    studentSubjectController.enrollStudent
);

// Teacher or Admin: View students of a subject
router.get(
    "/subject/:subjectId/students",
    verifyToken,
    authorizeRoles("teacher", "admin"),
    studentSubjectController.getSubjectStudents
);

// Student only: View enrollment subjects
router.get(
    "/my-subjects",
    verifyToken,
    authorizeRoles("student"),
    studentSubjectController.getMySubjects
);

module.exports = router;
