const Submission = require("../models/submission.model");
const Assignment = require("../models/assignment.model");
const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { createNotification } = require("./notification.controller");

// POST /api/submissions
const createSubmission = async (req, res, next) => {
    try {
        const { assignmentId } = req.body;
        const userId = req.user.id;

        // File must be present (multer populates req.file)
        if (!req.file) throw new AppError("File is required", 400);

        // Assignment must exist
        const assignment = await Assignment.findById(assignmentId).populate("subject");
        if (!assignment) throw new AppError("Assignment not found", 404);

        const subject = assignment.subject;

        // Validation: Verify student is enrolled in the subject
        const enrollment = await StudentSubject.findOne({ student: userId, subject: subject._id });
        if (!enrollment) throw new AppError("You are not enrolled in this subject", 403);

        // Deadline must not have passed
        if (new Date() > new Date(assignment.deadline))
            throw new AppError("Submission deadline has passed", 400);

        // Prevent duplicate submission (also enforced by DB unique index)
        const existing = await Submission.findOne({ student: student._id, assignment: assignmentId });
        if (existing) throw new AppError("You have already submitted this assignment", 409);

        const submission = await Submission.create({
            assignment: assignmentId,
            student: student._id,
            fileUrl: req.file.path,
            submittedAt: new Date(),
        });

        return sendResponse(res, 201, true, "Submission created successfully", { submission });
    } catch (error) {
        next(error);
    }
};

// GET /api/submissions/assignment/:assignmentId
const getSubmissionsByAssignment = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const { role, id } = req.user;

        const assignment = await Assignment.findById(assignmentId).populate("subject");
        if (!assignment) throw new AppError("Assignment not found", 404);

        if (role === "teacher") {
            const subject = await Subject.findById(assignment.subject._id);
            if (!subject || subject.teacher.toString() !== id)
                throw new AppError("Access forbidden: you are not the assigned teacher for this subject", 403);
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate({ path: "student", populate: { path: "user", select: "name email" } })
            .sort({ submittedAt: -1 });

        return sendResponse(res, 200, true, "Submissions fetched successfully", { submissions });
    } catch (error) {
        next(error);
    }
};

// PUT /api/submissions/:submissionId/grade
const gradeSubmission = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;
        const teacherId = req.user.id;

        const submission = await Submission.findById(submissionId)
            .populate({ path: "student", populate: { path: "user" } }) // Populate student and their user info
            .populate({
                path: "assignment",
                populate: { path: "subject" },
            });
        if (!submission) throw new AppError("Submission not found", 404);

        const subject = submission.assignment.subject;

        // Teacher must be the assigned teacher of the subject
        if (subject.teacher.toString() !== teacherId)
            throw new AppError("You are not the assigned teacher for this subject", 403);

        submission.grade = grade;
        submission.feedback = feedback;
        await submission.save();

        // Notify the student (non-blocking)
        await createNotification(
            submission.student.user._id, // Assuming submission.student.user is the user ID
            "Assignment Graded",
            "Your assignment has been graded.",
            "grade"
        );

        return sendResponse(res, 200, true, "Submission graded successfully", { submission });
    } catch (error) {
        next(error);
    }
};

module.exports = { createSubmission, getSubmissionsByAssignment, gradeSubmission };
