import User from "../../src/features/user/user.model.js";
import Course from "../../src/features/course/course.model.js";

import { ROLES } from "../../src/features/user/user.constants.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";

import { createTestCourse } from "./course.helper.js";
import { createTestOrder } from "./order.helper.js";
import { createTestPayment } from "./payment.helper.js";
import { createTestEnrollment } from "./enrollment.helper.js";

///////////////////////////////////////////////////////////////
// create test dashboard user

const createTestDashboardUser = async ({
    role = ROLES.STUDENT,
    username = "Test Dashboard User",
    isActive = true,
} = {}) => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return User.create({
        username,
        email: `test_dashboard_${uniqueId}@example.com`,
        password: "TestPassword123!",
        role,
        isEmailVerified: true,
        isActive,
    });
};

///////////////////////////////////////////////////////////////
// create test dashboard instructor

const createTestDashboardInstructor = async (options = {}) => {
    return createTestDashboardUser({
        role: ROLES.INSTRUCTOR,
        ...options,
    });
};

///////////////////////////////////////////////////////////////
// create test dashboard student

const createTestDashboardStudent = async (options = {}) => {
    return createTestDashboardUser({
        role: ROLES.STUDENT,
        ...options,
    });
};

///////////////////////////////////////////////////////////////
// create test dashboard admin

const createTestDashboardAdmin = async (options = {}) => {
    return createTestDashboardUser({
        role: ROLES.ADMIN,
        ...options,
    });
};

///////////////////////////////////////////////////////////////
// create test dashboard course

const createTestDashboardCourse = async ({
    instructorId,
    status = RESOURCE_STATUS.PUBLISHED,
    isDeleted = false,
} = {}) => {
    const course = await createTestCourse({
        instructorId,
    });

    return Course.findByIdAndUpdate(
        course._id,
        {
            status,
            isDeleted,
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// create test dashboard enrollment

const createTestDashboardEnrollment = async ({
    studentId,
    courseId,
    amount,
    isDeleted = false,
} = {}) => {
    const order = await createTestOrder({
        studentId,
        courseId,
        amount,
    });

    const payment = await createTestPayment({
        orderId: order._id,
        studentId,
        amount,
    });

    const enrollment = await createTestEnrollment({
        studentId,
        courseId,
        orderId: order._id,
        paymentId: payment._id,
        isDeleted,
    });

    return {
        order,
        payment,
        enrollment,
    };
};

///////////////////////////////////////////////////////////////
// exports

export {
    createTestDashboardUser,
    createTestDashboardInstructor,
    createTestDashboardStudent,
    createTestDashboardAdmin,
    createTestDashboardCourse,
    createTestDashboardEnrollment,
};
