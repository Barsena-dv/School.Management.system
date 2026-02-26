const express = require("express");
const { createSubject, getAllSubjects, getSubjectById } = require("../controllers/subject.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createSubject);
router.get("/", verifyToken, authorizeRoles("admin", "teacher","student"), getAllSubjects);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher","student"), getSubjectById);

module.exports = router;
