const { sendResponse } = require("../utils/apiResponse");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const studentService = require("../services/student.service");

const createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudentService(req.body);
        return sendResponse(res, 201, true, "Student profile created successfully", { student });
    } catch (error) {
        next(error);
    }
};

const getAllStudents = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const { page, limit, skip } = parsePagination(req.query);

        const { students, total } = await studentService.getAllStudentsService(role, id, skip, limit);
        
        return sendResponse(res, 200, true, "Students fetched successfully", { students }, paginationMeta(total, page, limit));
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const student = await studentService.getStudentByIdService(req.params.id, role, id);
        return sendResponse(res, 200, true, "Student fetched successfully", { student });
    } catch (error) {
        next(error);
    }
};

module.exports = { createStudent, getAllStudents, getStudentById };
