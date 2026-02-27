const Attendance = require("../models/attendance.model");
const Assessment = require("../models/assessment.model");
const Mark = require("../models/mark.model");
const Notification = require("../models/notification.model");
const Student = require("../models/student.model");
const StudentSubject = require("../models/studentSubject.model");
const AppError = require("../utils/appError");
const { sendResponse } = require("../utils/apiResponse");

const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch Student Profile
    const student = await Student.findOne({ user: userId })
      .populate("class", "name")
      .populate("user", "name email avatar");

    if (!student) throw new AppError("Student profile not found", 404);

    const studentId = student._id;

    // 2. Fetch Enrolled Subject IDs
    const enrollmentDocs = await StudentSubject.find({ student: studentId }).select("subject");
    const subjectIds = enrollmentDocs.map(doc => doc.subject);

    // 3. Fetch Dashboard Data in Parallel
    const [
      attendanceStats,
      upcomingAssessmentDocs,
      recentMarkDocs,
      summaryCounts
    ] = await Promise.all([
      // Attendance Percentage
      Attendance.aggregate([
        { $match: { student: studentId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: {
              $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
            }
          }
        }
      ]),

      // Upcoming Assessments
      Assessment.find({
        subject: { $in: subjectIds },
        date: { $gte: today }
      })
        .populate("subject", "name")
        .sort({ date: 1 })
        .limit(5)
        .lean(),

      // Recent Marks
      Mark.find({ student: studentId })
        .populate({
          path: "assessment",
          select: "title maxMarks",
          populate: { path: "subject", select: "name" }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Summary Stats
      Promise.all([
        Assessment.countDocuments({ subject: { $in: subjectIds } }),
        Mark.countDocuments({ student: studentId }),
        Notification.countDocuments({ user: userId, read: false })
      ])
    ]);

    // 4. Process Attendance
    const attData = attendanceStats[0] || { total: 0, present: 0 };
    const attendancePercentage = attData.total > 0
      ? parseFloat(((attData.present / attData.total) * 100).toFixed(2))
      : 0;

    let attendanceStatus = "Critical";
    if (attendancePercentage >= 75) attendanceStatus = "Excellent";
    else if (attendancePercentage >= 60) attendanceStatus = "Warning";

    // 5. Process Upcoming Assessments
    const upcomingAssessments = upcomingAssessmentDocs.map(doc => {
      const daysLeft = Math.ceil((new Date(doc.date) - today) / (1000 * 60 * 60 * 24));
      return {
        _id: doc._id,
        title: doc.title,
        subject: doc.subject?.name,
        date: doc.date,
        daysLeft: Math.max(0, daysLeft),
        isUrgent: daysLeft <= 2
      };
    });
    console.log("Student ID:", studentId);
console.log("Subject IDs:", subjectIds);

    // 6. Process Recent Marks
    const recentMarks = recentMarkDocs.map(doc => {
      const percentage = doc.assessment
        ? parseFloat(((doc.marksObtained / doc.assessment.maxMarks) * 100).toFixed(2))
        : 0;
      return {
        _id: doc._id,
        assessmentTitle: doc.assessment?.title,
        subject: doc.assessment?.subject?.name,
        marksObtained: doc.marksObtained,
        maxMarks: doc.assessment?.maxMarks,
        percentage,
        result: percentage >= 40 ? "Pass" : "Fail"
      };
    });

    // 7. Build Final Response
    return sendResponse(res, 200, true, "Student dashboard retrieved successfully", {
      profile: {
        name: student.user?.name,
        email: student.user?.email,
        avatar: student.user?.avatar,
        rollNumber: student.rollNumber,
        className: student.class?.name
      },
      attendance: {
        percentage: attendancePercentage,
        status: attendanceStatus,
        totalClasses: attData.total,
        presentCount: attData.present
      },
      upcomingAssessments,
      recentMarks,
      summary: {
        totalEnrolledSubjects: subjectIds.length,
        totalAssessments: summaryCounts[0],
        totalMarksGiven: summaryCounts[1],
        unreadNotificationsCount: summaryCounts[2]
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard
};