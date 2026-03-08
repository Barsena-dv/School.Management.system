const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const Assignment = require("../models/assignment.model");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { sendResponse } = require("../utils/apiResponse");

const router = express.Router();

/**
 * GET /api/debug/student-info
 * Returns full diagnostic info for the logged-in student:
 *  - User ID from JWT
 *  - Student profile
 *  - Enrollments
 *  - Raw assignment filter result
 */
router.get(
    "/student-info",
    verifyToken,
    authorizeRoles("student"),
    async (req, res, next) => {
        try {
            const userId = req.user.id;

            const student = await Student.findOne({ user: userId });

            if (!student) {
                return sendResponse(res, 404, false, "No student profile found for this user", {
                    userId,
                    student: null,
                    enrollments: [],
                    assignments: [],
                });
            }

            const enrollments = await StudentSubject.find({ student: student._id })
                .populate("subject", "name");

            const subjectIds = enrollments.map(e => e.subject?._id);

            const assignments = await Assignment.find({
                subject: { $in: subjectIds }
            }).populate("subject", "name").limit(20);

            return sendResponse(res, 200, true, "Student debug info", {
                userId,
                studentId: student._id,
                enrollmentCount: enrollments.length,
                enrollments: enrollments.map(e => ({
                    enrollmentId: e._id,
                    subjectId: e.subject?._id,
                    subjectName: e.subject?.name,
                })),
                subjectIds,
                assignmentCount: assignments.length,
                assignments: assignments.map(a => ({
                    id: a._id,
                    title: a.title,
                    subject: a.subject?.name,
                })),
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
