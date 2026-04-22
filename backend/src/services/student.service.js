const Student = require("../models/student.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const AppError = require("../utils/appError");

const POPULATE = [
    { path: "user", select: "name email" },
    { path: "class", select: "grade section academicYear classTeacher" },
];

const createStudentService = async (studentData) => {
    const { userId, classId, rollNumber, dateOfBirth, guardianName, contactNumber } = studentData;

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
    
    return populated;
};

const getAllStudentsService = async (userRole, userId, skip, limit) => {
    if (userRole === "student") throw new AppError("Access forbidden", 403);

    let query = {};
    if (userRole === "teacher") {
        const teacherClasses = await Class.find({ classTeacher: userId }).select("_id");
        const classIds = teacherClasses.map((c) => c._id);
        query = { class: { $in: classIds } };
    }

    const [students, total] = await Promise.all([
        Student.find(query).populate(POPULATE).skip(skip).limit(limit),
        Student.countDocuments(query),
    ]);

    return { students, total };
};

const getStudentByIdService = async (studentId, userRole, userId) => {
    const student = await Student.findById(studentId).populate(POPULATE);
    if (!student) throw new AppError("Student not found", 404);

    if (userRole === "admin") return student;

    if (userRole === "teacher") {
        if (student.class?.classTeacher?.toString() !== userId) throw new AppError("Access forbidden: student not in your class", 403);
        return student;
    }

    if (userRole === "student") {
        if (student.user._id.toString() !== userId) throw new AppError("Access forbidden", 403);
        return student;
    }
    
    throw new AppError("Access forbidden", 403);
};

module.exports = {
    createStudentService,
    getAllStudentsService,
    getStudentByIdService,
};
