const Submission = require("../models/submission.model");
const Mark = require("../models/mark.model");
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

        // Fetch student profile using req.user.id
        const student = await Student.findOne({ user: userId });
        if (!student) throw new AppError("Student profile not found. Please contact administration.", 404);

        // Validation: Verify student is enrolled in the subject
        // StudentSubject now references Student._id, not User.id
        const enrollment = await StudentSubject.findOne({ student: student._id, subject: subject._id });
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

        // Validation: Grade must be present and a valid number
        if (grade === undefined || isNaN(grade))
            throw new AppError("A valid numeric grade is required", 400);

        const submission = await Submission.findById(submissionId)
            .populate({ path: "student", populate: { path: "user" } })
            .populate({
                path: "assignment",
                populate: { path: "subject" },
            });
        if (!submission) throw new AppError("Submission not found", 404);

        const assignment = submission.assignment;
        const subject = assignment.subject;

        // Teacher must be the assigned teacher of the subject
        if (subject.teacher.toString() !== teacherId)
            throw new AppError("You are not the assigned teacher for this subject", 403);

        // Validation: Grade boundary checks
        if (grade < 0) throw new AppError("Grade cannot be negative", 400);
        if (grade > assignment.maxMarks)
            throw new AppError(`Grade (${grade}) cannot exceed maximum marks (${assignment.maxMarks})`, 400);

        // Update submission
        submission.grade = grade;
        submission.feedback = feedback || submission.feedback;
        submission.status = "graded";
        await submission.save();

        // ─── SYNC WITH MARK MODEL ──────────────────────────────────────────
        // Upsert Mark document (respecting student and assignment relationship)
        // Since an assignment belongs to a subject, it satisfies the Mark model requirements
        await Mark.findOneAndUpdate(
            {
                student: submission.student._id,
                assessment: assignment._id // Reusing assignment ID as assessment ID for marks
            },
            {
                marksObtained: grade
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        // Notify the student (non-blocking)
        await createNotification(
            submission.student.user._id,
            "Assignment Graded",
            `Your assignment "${assignment.title}" has been graded with ${grade}/${assignment.maxMarks}.`,
            "grade"
        );

        return sendResponse(res, 200, true, "Submission graded and marks synchronized successfully", { submission });
    } catch (error) {
        next(error);
    }
};

const getMySubmissions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const student = await Student.findOne({ user: userId });
        if (!student) throw new AppError("Student profile not found", 404);

        const submissions = await Submission.find({ student: student._id })
            .populate({
                path: "assignment",
                select: "title deadline",
                populate: { path: "subject", select: "name" }
            })
            .sort({ createdAt: -1 })
            .lean();

        return sendResponse(res, 200, true, "Your submissions fetched successfully", { submissions });
    } catch (error) {
        next(error);
    }
};

module.exports = { createSubmission, getSubmissionsByAssignment, gradeSubmission, getMySubmissions };
