const Assignment = require("../models/assignment.model");
const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const AppError = require("../utils/appError");
const { createNotification } = require("../controllers/notification.controller");

const createAssignmentService = async (assignmentData, teacherId) => {
    const { title, description, subjectId, deadline, maxMarks } = assignmentData;

    // Subject must exist
    const subject = await Subject.findById(subjectId);
    if (!subject) throw new AppError("Subject not found", 404);

    // Teacher must be the assigned teacher of the subject
    if (subject.teacher.toString() !== teacherId) {
        throw new AppError("You are not the assigned teacher for this subject", 403);
    }

    const assignment = await Assignment.create({
        title,
        description,
        maxMarks,
        subject: subjectId,
        deadline,
        createdBy: teacherId,
    });

    // Notify all students in the subject's class (non-blocking process)
    const students = await Student.find({ class: subject.class }).select("user");
    Promise.all(
        students.map((s) =>
            createNotification(
                s.user,
                "New Assignment",
                "A new assignment has been posted for your subject.",
                "assignment"
            )
        )
    ).catch(err => console.error("Error creating notifications:", err));

    return assignment;
};

const getAssignmentsBySubjectService = async (subjectId, userRole, userId) => {
    const subject = await Subject.findById(subjectId);
    if (!subject) throw new AppError("Subject not found", 404);

    if (userRole === "teacher") {
        if (subject.teacher.toString() !== userId)
            throw new AppError("Access forbidden: you are not the assigned teacher for this subject", 403);
    }

    if (userRole === "student") {
        // Fetch student profile
        const student = await Student.findOne({ user: userId });
        if (!student) throw new AppError("Student profile not found", 404);

        // Verify student is enrolled in the subject
        const enrollment = await StudentSubject.findOne({ student: student._id, subject: subjectId });
        if (!enrollment) throw new AppError("Access forbidden: you are not enrolled in this subject", 403);
    }

    const assignments = await Assignment.find({ subject: subjectId })
        .populate("createdBy", "name email")
        .sort({ deadline: 1 }); // ascending — soonest deadline first

    return assignments;
};

const getAllAssignmentsService = async (userRole, userId) => {
    let filter = {};

    if (userRole === "teacher") {
        filter.createdBy = userId;
    }

    if (userRole === "student") {
        // Fetch student profile
        const student = await Student.findOne({ user: userId });
        if (!student) return [];

        // Fetch enrollments using Student._id and build filter
        const enrollments = await StudentSubject.find({ student: student._id });
        const subjectIds = enrollments.map(e => e.subject);
        filter.subject = { $in: subjectIds };
    }

    const assignments = await Assignment.find(filter)
        .populate("subject", "name")
        .populate("createdBy", "name email")
        .sort({ deadline: 1 });

    return assignments;
};

module.exports = {
    createAssignmentService,
    getAssignmentsBySubjectService,
    getAllAssignmentsService,
};
