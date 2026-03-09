const express = require("express");
const router = express.Router();
const studentSubjectController = require("../controllers/studentSubject.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Admin only: Get all enrollments
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    studentSubjectController.getAllEnrollments
);

// Admin only: Get all student profiles (for enrollment dropdown)
router.get(
    "/students",
    verifyToken,
    authorizeRoles("admin"),
    studentSubjectController.getStudentProfiles
);

// Admin only: Enroll a student
router.post(
    "/enroll",
    verifyToken,
    authorizeRoles("admin"),
    studentSubjectController.enrollStudent
);

// Admin only: Delete an enrollment
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    studentSubjectController.deleteEnrollment
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

