const Student = require("../models/student.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const { sendResponse } = require("../utils/apiResponse");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const AppError = require("../utils/appError");

const POPULATE = [
    { path: "user", select: "name email" },
    { path: "class", select: "grade section academicYear classTeacher" },
];

const createStudent = async (req, res, next) => {
    try {
        const { userId, classId, rollNumber, dateOfBirth, guardianName, contactNumber } = req.body;

        const user = await User.findById(userId);
        if (!user) throw new AppError("User not found", 404);
        if (user.role !== "student") throw new AppError("User must have the 'student' role", 400);
        if (user.status !== "approved") throw new AppError("User account must be approved before creating a profile", 400);

        const classExists = await Class.findById(classId);
        if (!classExists) throw new AppError("Class not found", 404);

        const existing = await Student.findOne({ user: userId });
        if (existing) throw new AppError("Student profile already exists for this user", 409);

        const student = await Student.create({ user: userId, class: classId, rollNumber, dateOfBirth, guardianName, contactNumber });
        const populated = await student.populate(POPULATE);
        return sendResponse(res, 201, true, "Student profile created successfully", { student: populated });
    } catch (error) {
        next(error);
    }
};

const getAllStudents = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const { page, limit, skip } = parsePagination(req.query);

        if (role === "student") throw new AppError("Access forbidden", 403);

        let query = {};
        if (role === "teacher") {
            const teacherClasses = await Class.find({ classTeacher: id }).select("_id");
            const classIds = teacherClasses.map((c) => c._id);
            query = { class: { $in: classIds } };
        }

        const [students, total] = await Promise.all([
            Student.find(query).populate(POPULATE).skip(skip).limit(limit),
            Student.countDocuments(query),
        ]);
        return sendResponse(res, 200, true, "Students fetched successfully", { students }, paginationMeta(total, page, limit));
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const student = await Student.findById(req.params.id).populate(POPULATE);
        if (!student) throw new AppError("Student not found", 404);

        if (role === "admin") return sendResponse(res, 200, true, "Student fetched successfully", { student });

        if (role === "teacher") {
            if (student.class?.classTeacher?.toString() !== id) throw new AppError("Access forbidden: student not in your class", 403);
            return sendResponse(res, 200, true, "Student fetched successfully", { student });
        }

        if (role === "student") {
            if (student.user._id.toString() !== id) throw new AppError("Access forbidden", 403);
            return sendResponse(res, 200, true, "Student fetched successfully", { student });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { createStudent, getAllStudents, getStudentById };
