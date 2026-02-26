const express = require("express");
const {
    createEvent,
    getEvents,
    applyForEvent,
    getRegistrations,
    updateRegistrationStatus,
} = require("../controllers/event.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// POST   /api/events                                    — admin, teacher
router.post("/", verifyToken, authorizeRoles("admin", "teacher"), createEvent);

// GET    /api/events                                    — all roles
router.get("/", verifyToken, authorizeRoles("admin", "teacher", "student"), getEvents);

// POST   /api/events/:eventId/apply                    — student only
router.post("/:eventId/apply", verifyToken, authorizeRoles("student"), applyForEvent);

// GET    /api/events/:eventId/registrations            — admin, teacher
router.get("/:eventId/registrations", verifyToken, authorizeRoles("admin", "teacher"), getRegistrations);

// PUT    /api/events/registrations/:registrationId/status — admin only
// NOTE: this static segment must come before /:eventId routes to avoid param clash
router.put("/registrations/:registrationId/status", verifyToken, authorizeRoles("admin"), updateRegistrationStatus);

module.exports = router;
