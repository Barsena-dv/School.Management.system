const { param, body, query } = require("express-validator");

const userIdValidation = [
    param("id").notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
];

const updateStatusValidation = [
    param("id").notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["approved", "suspended", "rejected", "pending"])
        .withMessage("Invalid status value"),
];

const queryRoleValidation = [
    query("role")
        .optional()
        .isIn(["student", "teacher", "admin"])
        .withMessage("Invalid role filter"),
];

module.exports = {
    userIdValidation,
    updateStatusValidation,
    queryRoleValidation,
};
