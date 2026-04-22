const { sendResponse } = require("../utils/apiResponse");
const assignmentService = require("../services/assignment.service");

const createAssignment = async (req, res, next) => {
    try {
        const teacherId = req.user.id;
        
        // Pass to service logic
        const assignment = await assignmentService.createAssignmentService(req.body, teacherId);

        return sendResponse(res, 201, true, "Assignment created successfully", { assignment });
    } catch (error) {
        next(error);
    }
};

const getAssignmentsBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const { role, id } = req.user;

        // Pass to service logic
        const assignments = await assignmentService.getAssignmentsBySubjectService(subjectId, role, id);

        return sendResponse(res, 200, true, "Assignments fetched successfully", { assignments });
    } catch (error) {
        next(error);
    }
};

const getAllAssignments = async (req, res, next) => {
    try {
        const { role, id } = req.user;

        // Pass to service logic
        const assignments = await assignmentService.getAllAssignmentsService(role, id);

        return sendResponse(res, 200, true, "Assignments fetched", { assignments });

    } catch (error) {
        next(error);
    }
};

module.exports = { createAssignment, getAssignmentsBySubject, getAllAssignments };
