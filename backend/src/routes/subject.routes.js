const express = require("express");
const { createSubject, getAllSubjects, getSubjectById, getStudentsBySubject, updateSubject, deleteSubject } = require("../controllers/subject.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createSubject);
router.get("/", verifyToken, authorizeRoles("admin", "teacher", "student"), getAllSubjects);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student"), getSubjectById);
router.patch("/:id", verifyToken, authorizeRoles("admin"), updateSubject);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteSubject);

// Students enrolled in a subject — teacher (assigned) or admin only
router.get("/:subjectId/students", verifyToken, authorizeRoles("admin", "teacher"), getStudentsBySubject);

module.exports = router;


