const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        grade: {
            type: Number,
        },
        feedback: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent a student from submitting the same assignment twice
submissionSchema.index({ student: 1, assignment: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
