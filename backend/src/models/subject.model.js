const mongoose = require("mongoose");
const User = require("./user.model");

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validate teacher has role "teacher"
subjectSchema.pre("save", async function () {
    if (this.isModified("teacher")) {
        const user = await User.findById(this.teacher);
        if (!user || user.role !== "teacher") {
            throw new Error("teacher must be a user with the 'teacher' role");
        }
    }
});

// Index on class for fetching all subjects in a class
subjectSchema.index({ class: 1 });
// Index on teacher for teacher dashboard queries
subjectSchema.index({ teacher: 1 });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
