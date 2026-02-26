const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");
const classRoutes = require("./routes/class.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const markRoutes = require("./routes/mark.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const subjectRoutes = require("./routes/subject.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const submissionRoutes = require("./routes/submission.routes");
const notificationRoutes = require("./routes/notification.routes");
const eventRoutes = require("./routes/event.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const studentSubjectRoutes = require("./routes/studentSubject.routes");
const assessmentRoutes = require("./routes/assessment.routes");



// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student-subjects", studentSubjectRoutes);
app.use("/api/assessments", assessmentRoutes);


app.use("/uploads", express.static("uploads"));
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server running' });
});

// Error handling middleware
const AppError = require("./utils/appError");
const { sendResponse } = require("./utils/apiResponse");

app.use((err, req, res, next) => {
    if (err instanceof AppError) {
        return sendResponse(res, err.statusCode, false, err.message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return sendResponse(res, 409, false, `Duplicate value for ${field}`);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const msg = Object.values(err.errors).map((e) => e.message).join(", ");
        return sendResponse(res, 400, false, msg);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") return sendResponse(res, 401, false, "Invalid token");
    if (err.name === "TokenExpiredError") return sendResponse(res, 401, false, "Token expired");

    // Unexpected error — log full stack, return generic message
    console.error("Unhandled error:", err);
    return sendResponse(res, 500, false, "Something went wrong");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
