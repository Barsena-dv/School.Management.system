const express = require("express");
const { createAssignment, getAssignmentsBySubject, getAllAssignments } = require("../controllers/assignment.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createAssignmentSchema, getAssignmentsBySubjectSchema } = require("../validations/assignment.validation");

const router = express.Router();

// POST /api/assignments — teacher only
router.post(
    "/",
    verifyToken,
    authorizeRoles("teacher"),
    validate(createAssignmentSchema),
    createAssignment
);

// GET /api/assignments
router.get("/", verifyToken, authorizeRoles("admin", "teacher", "student"), getAllAssignments);

// GET /api/assignments/subject/:subjectId — admin, teacher, student
router.get(
    "/subject/:subjectId",
    verifyToken,
    authorizeRoles("admin", "teacher", "student"),
    validate(getAssignmentsBySubjectSchema),
    getAssignmentsBySubject
);

module.exports = router;
