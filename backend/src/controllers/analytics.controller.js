const Mark = require("../models/mark.model");
const Attendance = require("../models/attendance.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");
const Assessment = require("../models/assessment.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const { sendResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const getStudentAnalytics = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { role, id } = req.user;

        // Validate student exists
        const student = await Student.findById(studentId).populate("class");
        if (!student) throw new AppError("Student not found", 404);

        // Role-based access control
        if (role === "teacher") {
            const hasSubject = await Subject.findOne({ class: student.class._id, assignedTeacher: id });
            if (!hasSubject) throw new AppError("Access forbidden: student not in your class", 403);
        }

        if (role === "student" && student.user.toString() !== id)
            throw new AppError("Access forbidden", 403);

        // --- Marks Aggregation ---
        const marksAgg = await Mark.aggregate([
            { $match: { student: student._id } },
            {
                $lookup: {
                    from: "assessments",
                    localField: "assessment",
                    foreignField: "_id",
                    as: "assessmentData",
                },
            },
            { $unwind: "$assessmentData" },
            {
                $group: {
                    _id: null,
                    totalAssessments: { $sum: 1 },
                    totalMarksObtained: { $sum: "$marksObtained" },
                    totalMaxMarks: { $sum: "$assessmentData.maxMarks" },
                },
            },
        ]);

        const marksData = marksAgg[0] || { totalAssessments: 0, totalMarksObtained: 0, totalMaxMarks: 0 };
        const percentage =
            marksData.totalMaxMarks > 0
                ? parseFloat(((marksData.totalMarksObtained / marksData.totalMaxMarks) * 100).toFixed(2))
                : 0;

        // --- Attendance Aggregation ---
        const attendanceAgg = await Attendance.aggregate([
            { $match: { student: student._id } },
            {
                $group: {
                    _id: null,
                    totalClasses: { $sum: 1 },
                    presentCount: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
        ]);

        const attendanceData = attendanceAgg[0] || { totalClasses: 0, presentCount: 0 };
        const attendancePercentage =
            attendanceData.totalClasses > 0
                ? parseFloat(((attendanceData.presentCount / attendanceData.totalClasses) * 100).toFixed(2))
                : 0;

        return sendResponse(res, 200, true, "Student analytics fetched successfully", {
            totalAssessments: marksData.totalAssessments,
            totalMarksObtained: marksData.totalMarksObtained,
            totalMaxMarks: marksData.totalMaxMarks,
            percentage,
            totalClasses: attendanceData.totalClasses,
            presentCount: attendanceData.presentCount,
            attendancePercentage,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminOverview = async (req, res, next) => {
    try {
        // --- Counts ---
        const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
            Student.countDocuments(),
            User.countDocuments({ role: "teacher", status: "approved" }),
            Class.countDocuments(),
        ]);

        // --- Overall Attendance Aggregation ---
        const attendanceAgg = await Attendance.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                },
            },
        ]);
        const attData = attendanceAgg[0] || { total: 0, present: 0 };
        const overallAttendancePercentage =
            attData.total > 0
                ? parseFloat(((attData.present / attData.total) * 100).toFixed(2))
                : 0;

        // --- Overall Performance Aggregation ---
        const marksAgg = await Mark.aggregate([
            {
                $lookup: {
                    from: "assessments",
                    localField: "assessment",
                    foreignField: "_id",
                    as: "assessmentData",
                },
            },
            { $unwind: "$assessmentData" },
            {
                $group: {
                    _id: null,
                    totalObtained: { $sum: "$marksObtained" },
                    totalMax: { $sum: "$assessmentData.maxMarks" },
                },
            },
        ]);
        const perfData = marksAgg[0] || { totalObtained: 0, totalMax: 0 };
        const overallPerformancePercentage =
            perfData.totalMax > 0
                ? parseFloat(((perfData.totalObtained / perfData.totalMax) * 100).toFixed(2))
                : 0;

        return sendResponse(res, 200, true, "Admin overview fetched successfully", {
            totalStudents,
            totalTeachers,
            totalClasses,
            overallAttendancePercentage,
            overallPerformancePercentage,
        });
    } catch (error) {
        next(error);
    }
};

const getTeacherOverview = async (req, res, next) => {
    try {
        const teacherId = req.user.id;

        // Get all subjects assigned to this teacher
        const subjects = await Subject.find({ assignedTeacher: teacherId }).lean();

        const result = await Promise.all(
            subjects.map(async (subject) => {
                // Count students in this subject's class
                const totalStudents = await Student.countDocuments({ class: subject.class });

                // Attendance aggregation for this subject
                const attAgg = await Attendance.aggregate([
                    { $match: { subject: subject._id } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                        },
                    },
                ]);
                const attData = attAgg[0] || { total: 0, present: 0 };
                const averageAttendancePercentage =
                    attData.total > 0
                        ? parseFloat(((attData.present / attData.total) * 100).toFixed(2))
                        : 0;

                // Marks aggregation for assessments under this subject
                const marksAgg = await Mark.aggregate([
                    {
                        $lookup: {
                            from: "assessments",
                            localField: "assessment",
                            foreignField: "_id",
                            as: "assessmentData",
                        },
                    },
                    { $unwind: "$assessmentData" },
                    { $match: { "assessmentData.subject": subject._id } },
                    {
                        $group: {
                            _id: null,
                            totalObtained: { $sum: "$marksObtained" },
                            totalMax: { $sum: "$assessmentData.maxMarks" },
                        },
                    },
                ]);
                const perfData = marksAgg[0] || { totalObtained: 0, totalMax: 0 };
                const averageMarksPercentage =
                    perfData.totalMax > 0
                        ? parseFloat(((perfData.totalObtained / perfData.totalMax) * 100).toFixed(2))
                        : 0;

                return {
                    subjectId: subject._id,
                    subjectName: subject.name,
                    totalStudents,
                    averageAttendancePercentage,
                    averageMarksPercentage,
                };
            })
        );

        return sendResponse(res, 200, true, "Teacher overview fetched successfully", { subjects: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStudentAnalytics, getAdminOverview, getTeacherOverview };
