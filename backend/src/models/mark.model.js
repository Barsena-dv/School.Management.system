const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment",
            required: true,
        },
        marksObtained: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate marks for same student in same assessment
markSchema.index({ student: 1, assessment: 1 }, { unique: true });

const Mark = mongoose.model("Mark", markSchema);

module.exports = Mark;
