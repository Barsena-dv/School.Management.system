const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const { sendResponse } = require("../utils/apiResponse");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const AppError = require("../utils/appError");
const StudentSubject = require("../models/studentSubject.model");

const createSubject = async (req, res, next) => {
    try {
        const { name, classId, teacherId } = req.body;

        const classDoc = await Class.findById(classId);
        if (!classDoc) throw new AppError("Class not found", 404);

        const assignedUser = await User.findById(teacherId);
        if (!assignedUser) throw new AppError("Teacher not found", 404);
        if (assignedUser.role !== "teacher") throw new AppError("Assigned user must have the 'teacher' role", 400);
        if (assignedUser.status !== "approved") throw new AppError("Teacher account must be approved", 400);

        const subject = await Subject.create({ name, class: classId, teacher: teacherId });
        return sendResponse(res, 201, true, "Subject created successfully", { subject });
    } catch (error) {
        next(error);
    }
};

const getAllSubjects = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        let filter = {};

        // TEACHER → only their subjects
        if (req.user.role === "teacher") {
            filter.teacher = req.user.id;
        }

        // STUDENT → only enrolled subjects
        if (req.user.role === "student") {
            const enrollments = await StudentSubject.find({ student: req.user.id });
            const subjectIds = enrollments.map(e => e.subject);
            filter._id = { $in: subjectIds };
        }

        const [subjects, total] = await Promise.all([
            Subject.find(filter)
                .populate("class", "grade section academicYear")
                .populate("teacher", "name email")
                .skip(skip)
                .limit(limit),
            Subject.countDocuments(filter),
        ]);

        return sendResponse(
            res,
            200,
            true,
            "Subjects fetched successfully",
            { subjects },
            paginationMeta(total, page, limit)
        );
    } catch (error) {
        next(error);
    }
};

const getSubjectById = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate("class", "grade section academicYear")
            .populate("teacher", "name email");

        if (!subject) throw new AppError("Subject not found", 404);

        // TEACHER restriction
        if (req.user.role === "teacher" && subject.teacher._id.toString() !== req.user.id) {
            throw new AppError("Access denied", 403);
        }

        // STUDENT restriction
        if (req.user.role === "student") {
            const enrollment = await StudentSubject.findOne({
                student: req.user.id,
                subject: subject._id
            });

            if (!enrollment) {
                throw new AppError("Access denied", 403);
            }
        }

        return sendResponse(res, 200, true, "Subject fetched successfully", { subject });
    } catch (error) {
        next(error);
    }
};

module.exports = { createSubject, getAllSubjects, getSubjectById };
