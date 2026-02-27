const Mark = require("../models/mark.model");
const Assessment = require("../models/assessment.model");
const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const addMark = async (req, res, next) => {
    try {
        const { studentId, assessmentId, marksObtained } = req.body;
        const teacherId = req.user.id;

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) throw new AppError("Assessment not found", 404);

        const subject = await Subject.findById(assessment.subject);
        if (!subject) throw new AppError("Subject not found for this assessment", 404);
        if (subject.teacher.toString() !== teacherId)
            throw new AppError("You are not the assigned teacher for this subject", 403);

        const student = await Student.findById(studentId);
        if (!student) throw new AppError("Student not found", 404);

        // Validation: Verify student is enrolled in the subject
        const enrollment = await StudentSubject.findOne({ student: student._id, subject: subject._id });
        if (!enrollment) throw new AppError("Student is not enrolled in this subject", 400);

        if (marksObtained > assessment.maxMarks)
            throw new AppError(`marksObtained (${marksObtained}) cannot exceed maxMarks (${assessment.maxMarks})`, 400);

        const existing = await Mark.findOne({ student: studentId, assessment: assessmentId });
        if (existing) throw new AppError("Marks already recorded for this student in this assessment", 409);

        const mark = await Mark.create({ student: studentId, assessment: assessmentId, marksObtained });
        return sendResponse(res, 201, true, "Marks recorded successfully", { mark });
    } catch (error) {
        next(error);
    }
};

const getMarksByAssessment = async (req, res, next) => {
    try {
        const { assessmentId } = req.params;
        const { role, id } = req.user;

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) throw new AppError("Assessment not found", 404);

        if (role === "teacher") {
            const subject = await Subject.findById(assessment.subject);
            if (!subject || subject.teacher.toString() !== id)
                throw new AppError("Access forbidden: not your subject", 403);
        }

        const marks = await Mark.find({ assessment: assessmentId })
            .populate({ path: "student", populate: { path: "user", select: "name email" } })
            .sort({ marksObtained: -1 });

        return sendResponse(res, 200, true, "Marks fetched successfully", { marks });
    } catch (error) {
        next(error);
    }
};

const getMarksByStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { role, id } = req.user;

        const student = await Student.findById(studentId).populate("class");
        if (!student) throw new AppError("Student not found", 404);

        if (role === "teacher") {
            const hasSubject = await Subject.findOne({ class: student.class._id, teacher: id });
            if (!hasSubject) throw new AppError("Access forbidden: student not in your class", 403);
        }
        if (role === "student" && student.user.toString() !== id)
            throw new AppError("Access forbidden", 403);

        const marks = await Mark.find({ student: studentId })
            .populate({ path: "assessment", select: "title maxMarks date", populate: { path: "subject", select: "name" } })
            .sort({ createdAt: -1 });

        return sendResponse(res, 200, true, "Marks fetched successfully", { marks });
    } catch (error) {
        next(error);
    }
};

module.exports = { addMark, getMarksByAssessment, getMarksByStudent };
