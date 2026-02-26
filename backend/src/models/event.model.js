const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        eventDate: {
            type: Date,
            required: true,
        },
        registrationDeadline: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            // optional — null means event is school-wide
        },
    },
    {
        timestamps: true,
    }
);

// Index on eventDate for chronological sorting and range queries
eventSchema.index({ eventDate: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
