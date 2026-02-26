const express = require("express");
const { createClass, getAllClasses, getClassById } = require("../controllers/class.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createClass);
router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAllClasses);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher"), getClassById);

module.exports = router;
