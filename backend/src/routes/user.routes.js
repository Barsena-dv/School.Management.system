const express = require("express");
const { approveUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.patch("/:id/approve", verifyToken, approveUser);

module.exports = router;
