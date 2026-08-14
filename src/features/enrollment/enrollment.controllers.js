import * as enrollmentService from "./enrollment.service.js";
import ApiResponse from "../../utils/response-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { ENROLLMENT_SUCCESS_MESSAGES } from "./enrollment.constants.js";

///////////////////////////////////////////////////////////////
// fetch student enrollments controller

const fetchStudentEnrollments = async (req, res) => {
    const enrollments = await enrollmentService.fetchStudentEnrollments({
        studentId: req.user._id,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED_ALL,
            data: enrollments,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch student enrollment by course controller

const fetchStudentEnrollmentByCourse = async (req, res) => {
    const enrollment = await enrollmentService.fetchStudentEnrollmentByCourse({
        studentId: req.user._id,
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED,
            data: enrollment,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch student current enrollment controller

const fetchStudentCurrentEnrollment = async (req, res) => {
    const enrollment = await enrollmentService.fetchStudentCurrentEnrollment({
        studentId: req.user._id,
        enrollmentId: req.params.enrollmentId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED,
            data: enrollment,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch course enrollments controller

const fetchCourseEnrollments = async (req, res) => {
    const enrollments = await enrollmentService.fetchCourseEnrollments({
        courseId: req.params.courseId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED_ALL,
            data: enrollments,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch all enrollments controller

const fetchAllEnrollments = async (req, res) => {
    const enrollments = await enrollmentService.fetchAllEnrollments();

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED_ALL,
            data: enrollments,
        })
    );
};

///////////////////////////////////////////////////////////////
// fetch enrollment controller

const fetchCurrentEnrollment = async (req, res) => {
    const enrollment = await enrollmentService.fetchCurrentEnrollment({
        enrollmentId: req.params.enrollmentId,
    });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: ENROLLMENT_SUCCESS_MESSAGES.FETCHED,
            data: enrollment,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export {
    fetchStudentEnrollments,
    fetchStudentEnrollmentByCourse,
    fetchStudentCurrentEnrollment,
    fetchCourseEnrollments,
    fetchAllEnrollments,
    fetchCurrentEnrollment,
};
