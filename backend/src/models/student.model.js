const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rollNumber: {
            type: String,
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        guardianName: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Unique index: one student profile per user account
studentSchema.index({ user: 1 }, { unique: true });
// Index on class for teacher-scoped student queries
studentSchema.index({ class: 1 });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
