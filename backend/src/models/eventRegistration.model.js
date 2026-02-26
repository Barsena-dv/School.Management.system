const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent a student from registering for the same event twice
eventRegistrationSchema.index({ student: 1, event: 1 }, { unique: true });

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);

module.exports = EventRegistration;
