const { validationResult } = require("express-validator");
const { sendResponse } = require("../utils/apiResponse");

const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Format errors neatly
        const extractedErrors = {};
        errors.array().forEach((err) => {
            if (!extractedErrors[err.path]) {
                extractedErrors[err.path] = err.msg;
            }
        });

        // 400 Bad Request
        return sendResponse(res, 400, false, "Validation failed", extractedErrors);
    };
};

module.exports = { validate };
