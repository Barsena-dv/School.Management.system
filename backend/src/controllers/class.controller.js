const Class = require("../models/class.model");
const User = require("../models/user.model");
const { sendResponse } = require("../utils/apiResponse");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const AppError = require("../utils/appError");

const createClass = async (req, res, next) => {
    try {
        const { grade, section, academicYear, classTeacher } = req.body;

        if (classTeacher) {
            const teacher = await User.findById(classTeacher);
            if (!teacher) throw new AppError("Teacher not found", 404);
            if (teacher.role !== "teacher") throw new AppError("Assigned user must have the 'teacher' role", 400);
            if (teacher.status !== "approved") throw new AppError("Teacher account must be approved", 400);
        }

        const newClass = await Class.create({ grade, section, academicYear, classTeacher });
        return sendResponse(res, 201, true, "Class created successfully", { class: newClass });
    } catch (error) {
        next(error);
    }
};

const getAllClasses = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [classes, total] = await Promise.all([
            Class.find().populate("classTeacher", "name email").skip(skip).limit(limit),
            Class.countDocuments(),
        ]);
        return sendResponse(res, 200, true, "Classes fetched successfully", { classes }, paginationMeta(total, page, limit));
    } catch (error) {
        next(error);
    }
};

const getClassById = async (req, res, next) => {
    try {
        const found = await Class.findById(req.params.id).populate("classTeacher", "name email");
        if (!found) throw new AppError("Class not found", 404);
        return sendResponse(res, 200, true, "Class fetched successfully", { class: found });
    } catch (error) {
        next(error);
    }
};

module.exports = { createClass, getAllClasses, getClassById };
