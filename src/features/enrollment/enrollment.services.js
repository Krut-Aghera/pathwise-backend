import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility";
import { ENROLLMENT_ERROR_MESSAGES } from "./enrollment.constants";
import * as enrollmentRepository from "./enrollment.repository.js";

const createEnrollment = async ({ enrollmentData }) => {
    const existingEnrollment = await enrollmentRepository.findEnrollment({
        studentId,
        courseId,
    });

    if (existingEnrollment) {
        throw new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message: ENROLLMENT_ERROR_MESSAGES.ALREADY_ENROLLED,
        });
    }

    const enrollmentPayload = {
        student: enrollmentData.student,
        course: enrollmentData.courseId,
        order: enrollmentData.order,
        payment: enrollmentData.payment,
        enrolledAt: Date.now(),
    };

    return enrollmentRepository.createEnrollment({ enrollmentPayload });
};

export { createEnrollment };
