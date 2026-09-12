import Enrollment from "../../src/features/enrollment/enrollment.model.js";

///////////////////////////////////////////////////////////////
// create test enrollment

const createTestEnrollment = async ({
    studentId,
    courseId,
    orderId,
    paymentId,
    isDeleted = false,
}) => {
    return await Enrollment.create({
        student: studentId,
        course: courseId,
        order: orderId,
        payment: paymentId,
        isDeleted,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestEnrollment };
