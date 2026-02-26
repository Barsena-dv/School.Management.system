const express = require("express");
const { createStudent, getAllStudents, getStudentById } = require("../controllers/student.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createStudent);
router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAllStudents);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student"), getStudentById);

module.exports = router;
