const Attendance = require("../models/attendance.model");
const Assessment = require("../models/assessment.model");
const Mark = require("../models/mark.model");
const Notification = require("../models/notification.model");
const { sendResponse } = require("../utils/apiResponse");
const Student = require("../models/student.model");

const AppError = require("../utils/appError");

const getStudentDashboard = async (req, res, next) => {
  try {
    if (req.user.role !== "student")
      throw new AppError("Access denied", 403);

    const student = await Student.findOne({ user: req.user.id })
      .populate("class")
      .populate("user", "name email");

    if (!student) throw new AppError("Student not found", 404);

    // Attendance %
    const totalAttendance = await Attendance.countDocuments({
      student: student._id,
    });

    const presentCount = await Attendance.countDocuments({
      student: student._id,
      status: "present",
    });

    const attendancePercentage =
      totalAttendance === 0
        ? 0
        : parseFloat(((presentCount / totalAttendance) * 100).toFixed(2));

    // Upcoming assessments
    const assessmentDocs = await Assessment.find({
      subject: { $in: await getStudentSubjectIds(student._id) },
      date: { $gte: new Date() },
    })
      .populate("subject", "name")
      .sort({ date: 1 })
      .limit(5);

    const upcomingAssessments = assessmentDocs.map(doc => {
      const daysLeft = Math.ceil((new Date(doc.date) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        title: doc.title,
        subject: doc.subject.name,
        date: new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysLeft: daysLeft > 0 ? daysLeft : 0
      };
    });

    // Recent marks
    const markDocs = await Mark.find({
      student: student._id,
    })
      .populate({
        path: "assessment",
        populate: { path: "subject", select: "name" }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentMarks = markDocs.map(doc => ({
      title: doc.assessment.title,
      subject: doc.assessment.subject.name,
      score: parseFloat(((doc.marksObtained / doc.assessment.maxMarks) * 100).toFixed(2))
    }));

    // Unread notifications
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    return sendResponse(res, 200, true, "Dashboard data fetched", {
      profile: student,
      attendancePercentage,
      upcomingAssessments,
      recentMarks,
      unreadNotifications: unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// helper
const StudentSubject = require("../models/studentSubject.model");

const getStudentSubjectIds = async (studentId) => {
  const enrollments = await StudentSubject.find({
    student: studentId,
  });
  return enrollments.map((e) => e.subject);
};

module.exports = { getStudentDashboard };