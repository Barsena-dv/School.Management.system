const Attendance = require("../models/attendance.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");
const StudentSubject = require("../models/studentSubject.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const markAttendance = async (req, res, next) => {
    try {
        const { studentId, subjectId, date, status } = req.body;
        const teacherId = req.user.id;

        const subject = await Subject.findById(subjectId);
        if (!subject) throw new AppError("Subject not found", 404);
        if (subject.teacher.toString() !== teacherId)
            throw new AppError("You are not the assigned teacher for this subject", 403);

        const student = await Student.findById(studentId);
        if (!student) throw new AppError("Student not found", 404);

        // Validation: Verify student is enrolled in the subject
        // student.user was previously used (User ID), now using student._id (Student ID)
        const enrollment = await StudentSubject.findOne({ student: student._id, subject: subjectId });
        if (!enrollment) throw new AppError("Student is not enrolled in this subject", 400);

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const existing = await Attendance.findOne({ student: studentId, subject: subjectId, date: attendanceDate });
        if (existing)
            throw new AppError("Attendance already marked for this student in this subject on this date", 409);

        const attendance = await Attendance.create({ student: studentId, subject: subjectId, date: attendanceDate, status, markedBy: teacherId });
        return sendResponse(res, 201, true, "Attendance marked successfully", { attendance });
    } catch (error) {
        next(error);
    }
};

const getAttendanceBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const { role, id } = req.user;

        const subject = await Subject.findById(subjectId);
        if (!subject) throw new AppError("Subject not found", 404);
        if (role === "teacher" && subject.teacher.toString() !== id)
            throw new AppError("Access forbidden: you are not the assigned teacher for this subject", 403);

        const records = await Attendance.find({ subject: subjectId })
            .populate({ path: "student", populate: { path: "user", select: "name email" } })
            .sort({ date: -1 });

        return sendResponse(res, 200, true, "Attendance records fetched successfully", { attendance: records });
    } catch (error) {
        next(error);
    }
};

const getAttendanceByStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { role, id } = req.user;

        const student = await Student.findById(studentId);
        if (!student) throw new AppError("Student not found", 404);

        if (!student.class) throw new AppError("Student has no class assigned", 400);


        if (role === "teacher") {
            const hasSubject = await Subject.findOne({ class: student.class, teacher: id });
            if (!hasSubject) throw new AppError("Access forbidden: student not in your class", 403);
        }
        if (role === "student" && student.user.toString() !== id)
            throw new AppError("Access forbidden", 403);

        const records = await Attendance.find({ student: studentId }).populate("subject", "name").sort({ date: -1 });
        return sendResponse(res, 200, true, "Attendance records fetched successfully", { attendance: records });
    } catch (error) {
        next(error);
    }
};

const getAllAttendance = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user.role === "teacher") {
            filter.markedBy = req.user.id;
        }

        if (req.user.role === "student") {
            const student = await Student.findOne({ user: req.user.id });
            if (!student) throw new AppError("Student profile not found", 404);

            const enrollments = await StudentSubject.find({ student: student._id });
            const subjectIds = enrollments.map(e => e.subject);
            filter.subject = { $in: subjectIds };
        }

        const records = await Attendance.find(filter)
            .populate("subject", "name")
            .populate({
                path: "student",
                populate: { path: "user", select: "name email" }
            })
            .sort({ date: -1 });

        return sendResponse(res, 200, true, "Attendance records fetched", { attendance: records });

    } catch (error) {
        next(error);
    }
};
module.exports = { markAttendance, getAttendanceBySubject, getAttendanceByStudent, getAllAttendance };