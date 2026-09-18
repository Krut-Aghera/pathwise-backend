import { createAuthenticatedStudentAgent } from "../helpers/auth.helper.js";
import {
    createTestDashboardInstructor,
    createTestDashboardStudent,
    createTestDashboardAdmin,
    createTestDashboardCourse,
    createTestDashboardEnrollment,
} from "../helpers/dashboard.helper.js";
import { createTestProgress } from "../helpers/progress.helper.js";

import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";
import { PROGRESS_STATUS } from "../../src/features/progress/progress.constants.js";

////////////////////////////////////////////////////////////////
// create base instructor dashboard scenario
//
// Instructor only.
// No courses, enrollments, payments, or students are created.
//
// Useful for testing an empty instructor dashboard.

const createInstructorDashboardScenario = async () => {
    const instructor = await createTestDashboardInstructor({
        username: "Dashboard Instructor",
    });

    return {
        instructor,
    };
};

////////////////////////////////////////////////////////////////
// create populated instructor dashboard scenario
//
// Instructor + published course + draft course + deleted course.
//
// Published course has one enrollment.
// Deleted course has one enrollment.
//
// Useful for testing instructor course, enrollment, and
// revenue statistics.

const createPopulatedInstructorDashboardScenario = async () => {
    const scenario = await createInstructorDashboardScenario();

    const publishedCourse = await createTestDashboardCourse({
        instructorId: scenario.instructor._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });

    const draftCourse = await createTestDashboardCourse({
        instructorId: scenario.instructor._id,
        status: RESOURCE_STATUS.DRAFT,
        isDeleted: false,
    });

    const deletedCourse = await createTestDashboardCourse({
        instructorId: scenario.instructor._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: true,
    });

    const studentOne = await createTestDashboardStudent({
        username: "Dashboard Student One",
    });

    const studentTwo = await createTestDashboardStudent({
        username: "Dashboard Student Two",
    });

    const publishedEnrollment = await createTestDashboardEnrollment({
        studentId: studentOne._id,
        courseId: publishedCourse._id,
        amount: publishedCourse.price,
    });

    const deletedCourseEnrollment = await createTestDashboardEnrollment({
        studentId: studentTwo._id,
        courseId: deletedCourse._id,
        amount: deletedCourse.price,
    });

    return {
        ...scenario,

        publishedCourse,
        draftCourse,
        deletedCourse,

        studentOne,
        studentTwo,

        publishedEnrollment,
        deletedCourseEnrollment,
    };
};

////////////////////////////////////////////////////////////////
// create base student dashboard scenario
//
// Authenticated student only.
// No enrollments or progress exist.
//
// Useful for testing an empty student dashboard.

const createStudentDashboardScenario = async () => {
    const { agent, user } = await createAuthenticatedStudentAgent();

    return {
        agent,
        user,
    };
};

////////////////////////////////////////////////////////////////
// create populated student dashboard scenario
//
// Authenticated student + two enrolled courses.
//
// One course has no progress.
// One course has completed progress.
//
// Useful for testing enrolled-course and completed-course
// statistics.

const createPopulatedStudentDashboardScenario = async () => {
    const scenario = await createStudentDashboardScenario();

    const instructor = await createTestDashboardInstructor({
        username: "Dashboard Instructor",
    });

    const enrolledCourse = await createTestDashboardCourse({
        instructorId: instructor._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });

    const completedCourse = await createTestDashboardCourse({
        instructorId: instructor._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });

    const enrolledCourseData = await createTestDashboardEnrollment({
        studentId: scenario.user._id,
        courseId: enrolledCourse._id,
        amount: enrolledCourse.price,
    });

    const completedCourseData = await createTestDashboardEnrollment({
        studentId: scenario.user._id,
        courseId: completedCourse._id,
        amount: completedCourse.price,
    });

    const progress = await createTestProgress({
        studentId: scenario.user._id,
        courseId: completedCourse._id,
    });

    progress.status = PROGRESS_STATUS.COMPLETED;
    progress.completedAt = new Date();

    await progress.save();

    return {
        ...scenario,

        instructor,

        enrolledCourse,
        completedCourse,

        enrolledCourseData,
        completedCourseData,

        progress,
    };
};

////////////////////////////////////////////////////////////////
// create base admin dashboard scenario
//
// Admin only.
// No instructors, students, courses, enrollments, or payments
// are created.
//
// Useful for testing an empty admin dashboard.

const createAdminDashboardScenario = async () => {
    const admin = await createTestDashboardAdmin({
        username: "Dashboard Admin",
    });

    return {
        admin,
    };
};

////////////////////////////////////////////////////////////////
// create populated admin dashboard scenario
//
// Admin + active/inactive instructors + active/inactive students
// + published/draft/removed courses + enrollments.
//
// Useful for testing all admin dashboard statistics and lists.

const createPopulatedAdminDashboardScenario = async () => {
    const scenario = await createAdminDashboardScenario();

    const instructorOne = await createTestDashboardInstructor({
        username: "Dashboard Instructor One",
    });

    const instructorTwo = await createTestDashboardInstructor({
        username: "Dashboard Instructor Two",
    });

    const inactiveInstructor = await createTestDashboardInstructor({
        username: "Dashboard Inactive Instructor",
        isActive: false,
    });

    const studentOne = await createTestDashboardStudent({
        username: "Dashboard Student One",
    });

    const studentTwo = await createTestDashboardStudent({
        username: "Dashboard Student Two",
    });

    const inactiveStudent = await createTestDashboardStudent({
        username: "Dashboard Inactive Student",
        isActive: false,
    });

    ////////////////////////////////////////////////////////////////
    // courses

    const publishedCourse = await createTestDashboardCourse({
        instructorId: instructorOne._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });

    const secondPublishedCourse = await createTestDashboardCourse({
        instructorId: instructorTwo._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });

    const draftCourse = await createTestDashboardCourse({
        instructorId: instructorOne._id,
        status: RESOURCE_STATUS.DRAFT,
        isDeleted: false,
    });

    const removedCourse = await createTestDashboardCourse({
        instructorId: instructorTwo._id,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: true,
    });

    ////////////////////////////////////////////////////////////////
    // enrollments

    const enrollmentOne = await createTestDashboardEnrollment({
        studentId: studentOne._id,
        courseId: publishedCourse._id,
        amount: publishedCourse.price,
    });

    const enrollmentTwo = await createTestDashboardEnrollment({
        studentId: studentTwo._id,
        courseId: secondPublishedCourse._id,
        amount: secondPublishedCourse.price,
    });

    const removedCourseEnrollment = await createTestDashboardEnrollment({
        studentId: studentOne._id,
        courseId: removedCourse._id,
        amount: removedCourse.price,
    });

    return {
        ...scenario,

        instructorOne,
        instructorTwo,
        inactiveInstructor,

        studentOne,
        studentTwo,
        inactiveStudent,

        publishedCourse,
        secondPublishedCourse,
        draftCourse,
        removedCourse,

        enrollmentOne,
        enrollmentTwo,
        removedCourseEnrollment,
    };
};

////////////////////////////////////////////////////////////////
// exports

export {
    createInstructorDashboardScenario,
    createPopulatedInstructorDashboardScenario,
    createStudentDashboardScenario,
    createPopulatedStudentDashboardScenario,
    createAdminDashboardScenario,
    createPopulatedAdminDashboardScenario,
};
