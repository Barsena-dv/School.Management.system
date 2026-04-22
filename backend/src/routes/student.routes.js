const express = require("express");
const { createStudent, getAllStudents, getStudentById } = require("../controllers/student.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createStudentValidation, getAllStudentsValidation, studentIdValidation } = require("../validations/student.validation");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), validate(createStudentValidation), createStudent);
router.get("/", verifyToken, authorizeRoles("admin", "teacher"), validate(getAllStudentsValidation), getAllStudents);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student"), validate(studentIdValidation), getStudentById);

module.exports = router;
