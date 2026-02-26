const Assessment = require("../models/assessment.model");
const Subject = require("../models/subject.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const Student = require("../models/student.model");
const { createNotification } = require("./notification.controller");


const createAssessment = async (req, res, next) => {
    try {
        const { title, subjectId, maxMarks, examType, date } = req.body;

        const subject = await Subject.findById(subjectId);
        if (!subject) throw new AppError("Subject not found", 404);

        if (subject.teacher.toString() !== req.user.id)
            throw new AppError("Not authorized for this subject", 403);

        const assessment = await Assessment.create({
            title,
            subject: subjectId,
            maxMarks,
            examType,
            date,
            createdBy: req.user.id,
        });
        if (!subject) {
  console.log("Subject not found");
  throw new AppError("Subject not found", 404);
}

console.log("Subject found");
console.log("Subject class:", subject?.class);
        // Get all students of the class
        const students = await Student.find({ class: subject.class }).select("user");

        // Send notification to each student
        await Promise.all(
            students.map((s) =>
                createNotification(
                    s.user,
                    "New Assessment Scheduled",
                    `New exam "${title}" has been scheduled.`,
                    "assessment"
                )
            )
        );
        return sendResponse(res, 201, true, "Assessment created", { assessment });
    } catch (error) {
        next(error);
    }
};

const getAllAssessments = async (req, res, next) => {
    try {
        const assessments = await Assessment.find().populate("subject", "name");
        return sendResponse(res, 200, true, "Assessments fetched", { assessments });
    } catch (error) {
        next(error);
    }
};

const getAssessmentsBySubject = async (req, res, next) => {
    try {
        const assessments = await Assessment.find({ subject: req.params.subjectId });
        return sendResponse(res, 200, true, "Assessments fetched", { assessments });
    } catch (error) {
        next(error);
    }
};

module.exports = { createAssessment, getAllAssessments, getAssessmentsBySubject };