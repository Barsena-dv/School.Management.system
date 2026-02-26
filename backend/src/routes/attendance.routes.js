const express = require("express");
const { markAttendance, getAttendanceBySubject, getAttendanceByStudent, getAllAttendance } = require("../controllers/attendance.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("teacher"), markAttendance);
router.get("/subject/:subjectId", verifyToken, authorizeRoles("admin", "teacher"), getAttendanceBySubject);
router.get("/student/:studentId", verifyToken, authorizeRoles("admin", "teacher", "student"), getAttendanceByStudent);

module.exports = router;
