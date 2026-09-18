import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";
import { DASHBOARD_SUCCESS_MESSAGES } from "./dashboard.constants.js";
import * as dashboardService from "./dashboard.service.js";

///////////////////////////////////////////////////////////////
// fetch instructor dashboard

const fetchInstructorDashboard = async (req, res) => {
    const dashboard = await dashboardService.fetchInstructorDashboard({
        instructorId: req.params.instructorId,
        authenticatedInstructorId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: DASHBOARD_SUCCESS_MESSAGES.INSTRUCTOR_DASHBOARD_FETCHED,
            data: dashboard,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch student dashboard

const fetchStudentDashboard = async (req, res) => {
    const dashboard = await dashboardService.fetchStudentDashboard({
        studentId: req.params.studentId,
        authenticatedUserId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: DASHBOARD_SUCCESS_MESSAGES.STUDENT_DASHBOARD_FETCHED,
            data: dashboard,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch admin dashboard

const fetchAdminDashboard = async (req, res) => {
    const dashboard = await dashboardService.fetchAdminDashboard({
        adminId: req.params.adminId,
        authenticatedAdminId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: DASHBOARD_SUCCESS_MESSAGES.ADMIN_DASHBOARD_FETCHED,
            data: dashboard,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export { fetchInstructorDashboard, fetchStudentDashboard, fetchAdminDashboard };
