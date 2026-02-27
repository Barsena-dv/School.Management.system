const StudentSubject = require("../models/studentSubject.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const { sendResponse } = require("../utils/apiResponse");

/**
 * Enroll a student in a subject (Admin only)
 * POST /api/student-subjects/enroll
 */
const enrollStudent = async (req, res) => {
    try {
        const { studentId, subjectId } = req.body; // studentId here is the User ID

        if (!studentId || !subjectId) {
            return sendResponse(res, 400, false, "studentId and subjectId are required");
        }

        // Verify Student profile exists for this User ID
        const studentProfile = await Student.findOne({ user: studentId });
        if (!studentProfile) {
            return sendResponse(res, 404, false, "Student profile not found for this user");
        }

        // Verify subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return sendResponse(res, 404, false, "Subject not found");
        }

        // Check if already enrolled using Student ID
        const existingEnrollment = await StudentSubject.findOne({ student: studentProfile._id, subject: subjectId });
        if (existingEnrollment) {
            return sendResponse(res, 400, false, "Student is already enrolled in this subject");
        }

        const enrollment = await StudentSubject.create({
            student: studentProfile._id,
            subject: subjectId
        });

        return sendResponse(res, 201, true, "Student enrolled successfully", enrollment);
    } catch (error) {
        console.error("Error in enrollStudent:", error);
        return sendResponse(res, 500, false, "Internal server error during enrollment");
    }
};

/**
 * Get students enrolled in a subject (Teacher or Admin)
 * GET /api/student-subjects/subject/:subjectId/students
 */
const getSubjectStudents = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const user = req.user;

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return sendResponse(res, 404, false, "Subject not found");
        }

        // If teacher, verify they are assigned to this subject
        // Note: subject.teacher is used now after previous refactor
        const teacherId = subject.teacher || subject.assignedTeacher;
        if (user.role === "teacher" && teacherId.toString() !== user.id) {
            return sendResponse(res, 403, false, "Access denied: You are not the teacher for this subject");
        }

        const enrollments = await StudentSubject.find({ subject: subjectId })
            .populate({
                path: "student",
                populate: { path: "user", select: "name email status" }
            })
            .sort({ enrolledAt: -1 });

        return sendResponse(res, 200, true, "Subject students fetched successfully", enrollments);
    } catch (error) {
        console.error("Error in getSubjectStudents:", error);
        return sendResponse(res, 500, false, "Internal server error while fetching subject students");
    }
};

/**
 * Get subjects I am enrolled in (Student only)
 * GET /api/student-subjects/my-subjects
 */
const getMySubjects = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch student profile first
        const studentProfile = await Student.findOne({ user: userId });
        if (!studentProfile) {
            return sendResponse(res, 404, false, "Student profile not found");
        }

        const enrollments = await StudentSubject.find({ student: studentProfile._id })
            .populate({
                path: "subject",
                select: "name class teacher",
                populate: {
                    path: "teacher",
                    select: "name email"
                }
            })
            .sort({ enrolledAt: -1 });

        return sendResponse(res, 200, true, "Enrolled subjects fetched successfully", enrollments);
    } catch (error) {
        console.error("Error in getMySubjects:", error);
        return sendResponse(res, 500, false, "Internal server error while fetching my subjects");
    }
};

module.exports = {
    enrollStudent,
    getSubjectStudents,
    getMySubjects
};
