import * as dashboardRepository from "./dashboard.repository.js";
import ApiError from "../../utils/error-handler.utility.js";

import { DASHBOARD_ERROR_MESSAGES } from "./dashboard.constants.js";
import HTTP_STATUS from "../../constants/http.constants.js";

///////////////////////////////////////////////////////////////
// fetch instructor dashboard

const fetchInstructorDashboard = async ({
    instructorId,
    authenticatedInstructorId,
}) => {
    if (instructorId.toString() !== authenticatedInstructorId.toString()) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message:
                DASHBOARD_ERROR_MESSAGES.INSTRUCTOR_DASHBOARD_ACCESS_DENIED,
        });
    }

    return await dashboardRepository.fetchInstructorDashboard({
        instructorId,
    });
};

///////////////////////////////////////////////////////////////
// fetch student dashboard

const fetchStudentDashboard = async ({ studentId, authenticatedUserId }) => {
    ///////////////////////////////////////////////////////////////
    // verify student owns the requested dashboard

    if (studentId.toString() !== authenticatedUserId.toString()) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: DASHBOARD_ERROR_MESSAGES.STUDENT_DASHBOARD_ACCESS_DENIED,
        });
    }

    ///////////////////////////////////////////////////////////////
    // fetch dashboard state

    return await dashboardRepository.fetchStudentDashboard({
        studentId,
    });
};

///////////////////////////////////////////////////////////////
// admin dashboard

const fetchAdminDashboard = async ({ adminId, authenticatedAdminId }) => {
    if (adminId.toString() !== authenticatedAdminId.toString()) {
        throw new ApiError({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message: DASHBOARD_ERROR_MESSAGES.ADMIN_DASHBOARD_ACCESS_DENIED,
        });
    }

    return await dashboardRepository.fetchAdminDashboard();
};

///////////////////////////////////////////////////////////////
// service exports

export { fetchInstructorDashboard, fetchStudentDashboard, fetchAdminDashboard };
