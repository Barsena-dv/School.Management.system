/**
 * Parses pagination query params with safe defaults.
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * Builds the meta object for paginated responses.
 * @param {number} total - Total document count
 * @param {number} page
 * @param {number} limit
 */
const paginationMeta = (total, page, limit) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});

module.exports = { parsePagination, paginationMeta };
