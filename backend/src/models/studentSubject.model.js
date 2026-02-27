const mongoose = require("mongoose");

const studentSubjectSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate enrollment: One student can be enrolled in a specific subject only once.
studentSubjectSchema.index({ student: 1, subject: 1 }, { unique: true });

// Index for fetching students of a subject
studentSubjectSchema.index({ subject: 1 });
// Index for fetching subjects of a student
studentSubjectSchema.index({ student: 1 });

const StudentSubject = mongoose.model("StudentSubject", studentSubjectSchema);

module.exports = StudentSubject;
