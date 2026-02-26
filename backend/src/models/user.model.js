const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            default: "student",
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

userSchema.pre("save", async function () {
    if (this.isNew && this.role === "admin") {
        this.status = "approved";
    }
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Explicit index on email for fast lookup (unique:true covers correctness, index covers speed)
// userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
