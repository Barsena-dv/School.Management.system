const StudentSubject = require("../models/studentSubject.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const { sendResponse } = require("../utils/apiResponse");

/**
 * Enroll a student in a subject (Admin only)
 * POST /api/student-subjects/enroll
 */
const enrollStudent = async (req, res) => {
    try {
        const { studentId, subjectId } = req.body;

        if (!studentId || !subjectId) {
            return sendResponse(res, 400, false, "studentId and subjectId are required");
        }

        // Verify student exists and is a student
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return sendResponse(res, 404, false, "Student not found or user is not a student");
        }

        // Verify subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return sendResponse(res, 404, false, "Subject not found");
        }

        // Check if already enrolled
        const existingEnrollment = await StudentSubject.findOne({ student: studentId, subject: subjectId });
        if (existingEnrollment) {
            return sendResponse(res, 400, false, "Student is already enrolled in this subject");
        }

        const enrollment = await StudentSubject.create({
            student: studentId,
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
        if (user.role === "teacher" && subject.assignedTeacher.toString() !== user.id) {
            return sendResponse(res, 403, false, "Access denied: You are not the teacher for this subject");
        }

        const enrollments = await StudentSubject.find({ subject: subjectId })
            .populate("student", "name email status")
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
        const studentId = req.user.id;

        const enrollments = await StudentSubject.find({ student: studentId })
            .populate({
                path: "subject",
                select: "name class assignedTeacher",
                populate: {
                    path: "assignedTeacher",
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
