const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        grade: {
            type: String,
            required: true,
        },
        section: {
            type: String,
            required: true,
        },
        academicYear: {
            type: String,
            required: true,
        },
        classTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
