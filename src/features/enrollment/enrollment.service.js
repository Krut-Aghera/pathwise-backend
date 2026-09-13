import * as enrollmentRepository from "./enrollment.repository.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { ENROLLMENT_ERROR_MESSAGES } from "./enrollment.constants.js";

///////////////////////////////////////////////////////////////
// create enrollment service

const createEnrollment = async ({ enrollmentPayload }) => {
    const enrollment = await enrollmentRepository.findEnrollment({
        studentId: enrollmentPayload.student,
        courseId: enrollmentPayload.course,
    });

    if (enrollment) {
        return enrollment;
    }

    try {
        return await enrollmentRepository.createEnrollment({
            enrollmentPayload: {
                student: enrollmentPayload.student,
                course: enrollmentPayload.course,
                order: enrollmentPayload.order,
                payment: enrollmentPayload.payment,
            },
        });
    } catch (error) {
        // Another concurrent request may have created the
        // enrollment after our initial lookup.
        if (error?.code !== 11000) {
            throw error;
        }

        const existingEnrollment = await enrollmentRepository.findEnrollment({
            studentId: enrollmentPayload.student,
            courseId: enrollmentPayload.course,
        });

        if (!existingEnrollment) {
            throw error;
        }

        return existingEnrollment;
    }
};

///////////////////////////////////////////////////////////////
// fetch student enrollments service

const fetchStudentEnrollments = async ({ studentId }) => {
    return enrollmentRepository.findEnrollmentsByStudent({
        studentId,
    });
};

///////////////////////////////////////////////////////////////
// fetch student enrollment by course service

const fetchStudentEnrollmentByCourse = async ({ studentId, courseId }) => {
    const enrollment = await enrollmentRepository.findEnrollment({
        studentId,
        courseId,
    });

    if (!enrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ENROLLMENT_ERROR_MESSAGES.NOT_ENROLLED,
        });
    }

    return enrollment;
};

///////////////////////////////////////////////////////////////
// fetch student current enrollment service

const fetchStudentCurrentEnrollment = async ({ studentId, enrollmentId }) => {
    const enrollment = await enrollmentRepository.findStudentEnrollmentById({
        studentId,
        enrollmentId,
    });

    if (!enrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ENROLLMENT_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    return enrollment;
};

///////////////////////////////////////////////////////////////
// fetch course enrollments service

const fetchCourseEnrollments = async ({ courseId }) => {
    return enrollmentRepository.findEnrollmentsByCourse({
        courseId,
    });
};

///////////////////////////////////////////////////////////////
// fetch all enrollments service

const fetchAllEnrollments = async () => {
    return enrollmentRepository.findAllEnrollments();
};

///////////////////////////////////////////////////////////////
// fetch enrollment service

const fetchCurrentEnrollment = async ({ enrollmentId }) => {
    const enrollment = await enrollmentRepository.findEnrollmentById({
        enrollmentId,
    });

    if (!enrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: ENROLLMENT_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    return enrollment;
};

//////////////////////////////////////////////////////////////
// exports

export {
    createEnrollment,
    fetchStudentEnrollments,
    fetchStudentEnrollmentByCourse,
    fetchStudentCurrentEnrollment,
    fetchCourseEnrollments,
    fetchAllEnrollments,
    fetchCurrentEnrollment,
};
