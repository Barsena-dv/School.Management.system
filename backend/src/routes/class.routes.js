const express = require("express");
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require("../controllers/class.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createClass);
router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAllClasses);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher"), getClassById);
router.patch("/:id", verifyToken, authorizeRoles("admin"), updateClass);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteClass);

module.exports = router;

