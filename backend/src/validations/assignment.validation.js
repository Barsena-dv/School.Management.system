const { body, param, query } = require("express-validator");

const createAssignmentSchema = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),
    body("subjectId")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID format"),
    body("deadline")
        .notEmpty()
        .withMessage("Deadline is required")
        .isISO8601()
        .withMessage("Deadline must be a valid date")
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error("Deadline must be a future date");
            }
            return true;
        }),
    body("maxMarks")
        .notEmpty()
        .withMessage("Maximum marks is required")
        .isNumeric()
        .withMessage("Maximum marks must be a number")
        .custom((value) => {
            if (value <= 0) {
                throw new Error("Maximum marks must be a positive number");
            }
            return true;
        }),
];

const getAssignmentsBySubjectSchema = [
    param("subjectId")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID format"),
];

module.exports = {
    createAssignmentSchema,
    getAssignmentsBySubjectSchema,
};
