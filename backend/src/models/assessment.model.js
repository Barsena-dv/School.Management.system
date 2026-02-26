const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        maxMarks: {
            type: Number,
            required: true,
        },
        examType: {
            type: String,
            enum: ["Midterm", "Final", "Unit Test", "Practical"],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
