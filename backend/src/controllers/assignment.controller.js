const Assignment = require("../models/assignment.model");
const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { createNotification } = require("./notification.controller");

const createAssignment = async (req, res, next) => {
    try {
        const { title, description, subjectId, deadline } = req.body;
        const teacherId = req.user.id;

        // Subject must exist
        const subject = await Subject.findById(subjectId);
        if (!subject) throw new AppError("Subject not found", 404);

        // Teacher must be the assigned teacher of the subject
        if (subject.teacher.toString() !== teacherId)
            throw new AppError("You are not the assigned teacher for this subject", 403);

        // Deadline must be in the future
        if (new Date(deadline) <= new Date())
            throw new AppError("Deadline must be a future date", 400);

        const assignment = await Assignment.create({
            title,
            description,
            subject: subjectId,
            deadline,
            createdBy: teacherId,
        });

        // Notify all students in the subject's class (non-blocking)
        const students = await Student.find({ class: subject.class }).select("user");
        await Promise.all(
            students.map((s) =>
                createNotification(
                    s.user,
                    "New Assignment",
                    "A new assignment has been posted for your subject.",
                    "assignment"
                )
            )
        );

        return sendResponse(res, 201, true, "Assignment created successfully", { assignment });
    } catch (error) {
        next(error);
    }
};

const getAssignmentsBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const { role, id } = req.user;

        const subject = await Subject.findById(subjectId);
        if (!subject) throw new AppError("Subject not found", 404);

        if (role === "teacher") {
            if (subject.teacher.toString() !== id)
                throw new AppError("Access forbidden: you are not the assigned teacher for this subject", 403);
        }

        if (role === "student") {
            // Validation: Verify student is enrolled in the subject
            const enrollment = await StudentSubject.findOne({ student: id, subject: subjectId });
            if (!enrollment) throw new AppError("Access forbidden: you are not enrolled in this subject", 403);
        }

        const assignments = await Assignment.find({ subject: subjectId })
            .populate("createdBy", "name email")
            .sort({ deadline: 1 }); // ascending — soonest deadline first

        return sendResponse(res, 200, true, "Assignments fetched successfully", { assignments });
    } catch (error) {
        next(error);
    }
};

const getAllAssignments = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter.createdBy = req.user.id;
    }

    if (req.user.role === "student") {
      const enrollments = await StudentSubject.find({ student: req.user.id });
      const subjectIds = enrollments.map(e => e.subject);
      filter.subject = { $in: subjectIds };
    }

    const assignments = await Assignment.find(filter)
      .populate("subject", "name")
      .populate("createdBy", "name email")
      .sort({ deadline: 1 });

    return sendResponse(res, 200, true, "Assignments fetched", { assignments });

  } catch (error) {
    next(error);
  }
};

module.exports = { createAssignment, getAssignmentsBySubject,getAllAssignments };
