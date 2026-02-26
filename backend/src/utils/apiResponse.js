/**
 * Sends a standardized JSON response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success
 * @param {string} message - Human-readable message
 * @param {any} [data=null] - Response payload
 * @param {object|null} [meta=null] - Optional metadata (pagination, counts, etc.)
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
    const body = { success, message };

    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;

    return res.status(statusCode).json(body);
};

module.exports = { sendResponse };
