const Event = require("../models/event.model");
const EventRegistration = require("../models/eventRegistration.model");
const Student = require("../models/student.model");
const Class = require("../models/class.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { createNotification } = require("./notification.controller");

// ─── Helper: notify a list of students ──────────────────────────────────────
const notifyStudents = async (students, title, message) => {
    await Promise.all(
        students.map((s) => createNotification(s.user, title, message, "event"))
    );
};

// ─── 1) POST /api/events ────────────────────────────────────────────────────
const createEvent = async (req, res, next) => {
    try {
        const { title, description, eventDate, registrationDeadline, targetClass } = req.body;
        const createdBy = req.user.id;

        // registrationDeadline must be before eventDate
        if (new Date(registrationDeadline) >= new Date(eventDate))
            throw new AppError("registrationDeadline must be before eventDate", 400);

        // Validate targetClass if provided
        if (targetClass) {
            const classDoc = await Class.findById(targetClass);
            if (!classDoc) throw new AppError("Target class not found", 404);
        }

        const event = await Event.create({
            title, description, eventDate, registrationDeadline, createdBy,
            ...(targetClass && { targetClass }),
        });

        // Notify students (class-scoped or all)
        const query = targetClass ? { class: targetClass } : {};
        const students = await Student.find(query).select("user");
        await notifyStudents(
            students,
            "New Event",
            `A new event "${title}" has been posted. Register before the deadline.`
        );

        return sendResponse(res, 201, true, "Event created successfully", { event });
    } catch (error) {
        next(error);
    }
};

// ─── 2) GET /api/events ─────────────────────────────────────────────────────
const getEvents = async (req, res, next) => {
    try {
        const { role, id } = req.user;

        let query = {};

        if (role === "student") {
            // Find the student's class
            const student = await Student.findOne({ user: id }).select("class");
            if (!student) throw new AppError("Student profile not found", 404);

            // Show global events (no targetClass) OR events for their class
            query = {
                $or: [
                    { targetClass: { $exists: false } },
                    { targetClass: null },
                    { targetClass: student.class },
                ],
            };
        }
        // admin/teacher see all — query stays {}

        const events = await Event.find(query)
            .populate("targetClass", "grade section")
            .populate("createdBy", "name email")
            .sort({ eventDate: 1 });

        return sendResponse(res, 200, true, "Events fetched successfully", { events });
    } catch (error) {
        next(error);
    }
};

// ─── 3) POST /api/events/:eventId/apply ─────────────────────────────────────
const applyForEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) throw new AppError("Event not found", 404);

        // Registration deadline must not have passed
        if (new Date() > new Date(event.registrationDeadline))
            throw new AppError("Registration deadline has passed", 400);

        const student = await Student.findOne({ user: userId });
        if (!student) throw new AppError("Student profile not found", 404);

        // If event is class-specific, student must belong to that class
        if (event.targetClass && student.class.toString() !== event.targetClass.toString())
            throw new AppError("This event is not open to your class", 403);

        // Prevent duplicate registration
        const existing = await EventRegistration.findOne({ student: student._id, event: eventId });
        if (existing) throw new AppError("You have already registered for this event", 409);

        const registration = await EventRegistration.create({
            event: eventId,
            student: student._id,
        });

        return sendResponse(res, 201, true, "Registration submitted successfully", { registration });
    } catch (error) {
        next(error);
    }
};

// ─── 4) GET /api/events/:eventId/registrations ──────────────────────────────
const getRegistrations = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) throw new AppError("Event not found", 404);

        const registrations = await EventRegistration.find({ event: eventId })
            .populate({ path: "student", populate: { path: "user", select: "name email" } })
            .sort({ createdAt: -1 });

        return sendResponse(res, 200, true, "Registrations fetched successfully", { registrations });
    } catch (error) {
        next(error);
    }
};

// ─── 5) PUT /api/events/registrations/:registrationId/status ────────────────
const updateRegistrationStatus = async (req, res, next) => {
    try {
        const { registrationId } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status))
            throw new AppError("Status must be 'approved' or 'rejected'", 400);

        const registration = await EventRegistration.findById(registrationId)
            .populate({ path: "student", select: "user" })
            .populate("event", "title");

        if (!registration) throw new AppError("Registration not found", 404);

        registration.status = status;
        await registration.save();

        // Notify the student
        const notifMessage =
            status === "approved"
                ? `Your registration for "${registration.event.title}" has been approved.`
                : `Your registration for "${registration.event.title}" has been rejected.`;

        await createNotification(registration.student.user, "Event Registration Update", notifMessage, "event");

        return sendResponse(res, 200, true, `Registration ${status} successfully`, { registration });
    } catch (error) {
        next(error);
    }
};

module.exports = { createEvent, getEvents, applyForEvent, getRegistrations, updateRegistrationStatus };
