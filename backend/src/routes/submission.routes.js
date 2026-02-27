const express = require("express");
const { createSubmission, getSubmissionsByAssignment, gradeSubmission, getMySubmissions } = require("../controllers/submission.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../config/upload");

const router = express.Router();

// POST /api/submissions — student only, multipart/form-data
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    upload.single("file"),
    createSubmission
);

// GET /api/submissions/assignment/:assignmentId — admin, teacher
router.get(
    "/assignment/:assignmentId",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getSubmissionsByAssignment
);

// GET /api/submissions/my — student only
router.get(
    "/my",
    verifyToken,
    authorizeRoles("student"),
    getMySubmissions
);

// PUT /api/submissions/:submissionId/grade — teacher only
router.put(
    "/:submissionId/grade",
    verifyToken,
    authorizeRoles("teacher"),
    gradeSubmission
);

module.exports = router;
