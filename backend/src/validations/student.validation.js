const { body, param, query } = require("express-validator");

const createStudentValidation = [
    body("userId").notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
    body("classId").notEmpty().withMessage("Class ID is required").isMongoId().withMessage("Invalid Class ID format"),
    body("rollNumber").trim().notEmpty().withMessage("Roll Number is required"),
    body("dateOfBirth").notEmpty().withMessage("Date of birth is required").isISO8601().withMessage("Valid date is required"),
    body("guardianName").trim().notEmpty().withMessage("Guardian Name is required"),
    body("contactNumber").trim().notEmpty().withMessage("Contact Number is required"),
];

const studentIdValidation = [
    param("id").notEmpty().withMessage("Student ID is required").isMongoId().withMessage("Invalid Student ID format"),
];

const getAllStudentsValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
];

module.exports = {
    createStudentValidation,
    studentIdValidation,
    getAllStudentsValidation,
};
