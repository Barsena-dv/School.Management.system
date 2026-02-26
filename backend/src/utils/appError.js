/**
 * Custom operational error class.
 * Use this for expected errors (validation, 404, 403, etc.)
 * that should be surfaced to the client.
 */
class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Marks as a known, expected error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
