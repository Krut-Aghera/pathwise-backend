import { createAuthenticatedStudentAgent } from "../helpers/auth.helper.js";
import { createTestInstructor } from "../helpers/user.helper.js";
import { createTestCourse } from "../helpers/course.helper.js";
import { createTestSection } from "../helpers/section.helper.js";
import { createTestLecture } from "../helpers/lecture.helper.js";
import { createTestOrder } from "../helpers/order.helper.js";
import { createTestPayment } from "../helpers/payment.helper.js";
import { createTestEnrollment } from "../helpers/enrollment.helper.js";
import {
    createTestProgress,
    makeTestLectureProgressExists,
} from "../helpers/progress.helper.js";

////////////////////////////////////////////////////////////////
// create enrolled course scenario

const createEnrolledCourseScenario = async ({
    lectureCount = 1,
    sectionCount = 1,
} = {}) => {
    const { agent, user } = await createAuthenticatedStudentAgent();

    const instructor = await createTestInstructor();

    const course = await createTestCourse({
        instructorId: instructor._id,
    });

    const sections = [];
    const lectures = [];

    for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++) {
        const section = await createTestSection({
            courseId: course._id,
            order: sectionIndex + 1,
        });

        sections.push(section);
    }

    const lecturesPerSection = Math.ceil(lectureCount / sectionCount);

    let createdLectureCount = 0;

    for (const section of sections) {
        for (
            let lectureIndex = 0;
            lectureIndex < lecturesPerSection &&
            createdLectureCount < lectureCount;
            lectureIndex++
        ) {
            const lecture = await createTestLecture({
                sectionId: section._id,
                order: lectureIndex + 1,
            });

            lectures.push(lecture);

            createdLectureCount++;
        }
    }

    const order = await createTestOrder({
        studentId: user._id,
        courseId: course._id,
        amount: course.price,
    });

    const payment = await createTestPayment({
        orderId: order._id,
        studentId: user._id,
        amount: course.price,
    });

    const enrollment = await createTestEnrollment({
        studentId: user._id,
        courseId: course._id,
        orderId: order._id,
        paymentId: payment._id,
    });

    return {
        agent,
        user,
        instructor,
        course,
        sections,
        lectures,
        lecture: lectures[0],
        order,
        payment,
        enrollment,
    };
};

////////////////////////////////////////////////////////////////
// create course progress scenario

const createCourseProgressScenario = async ({
    lectureCount = 1,
    sectionCount = 1,
} = {}) => {
    const scenario = await createEnrolledCourseScenario({
        lectureCount,
        sectionCount,
    });

    const progress = await createTestProgress({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
    });

    return {
        ...scenario,
        progress,
    };
};

////////////////////////////////////////////////////////////////
// create initialized lecture progress scenario

const createInitializedLectureProgressScenario = async ({
    lectureCount = 1,
    sectionCount = 1,
    lectureIndex = 0,
    lastPosition = 100,
    watchedDuration = 110,
    isCompleted = false,
} = {}) => {
    const scenario = await createCourseProgressScenario({
        lectureCount,
        sectionCount,
    });

    const lecture = scenario.lectures[lectureIndex];

    if (!lecture) {
        throw new Error(`Lecture at index ${lectureIndex} does not exist.`);
    }

    const progress = await makeTestLectureProgressExists({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
        lectureId: lecture._id,
        lastPosition,
        watchedDuration,
        isCompleted,
    });

    return {
        ...scenario,
        lecture,
        lectureProgress: progress.lectures.at(-1),
    };
};

////////////////////////////////////////////////////////////////
// create completed lecture progress scenario

const createCompletedLectureProgressScenario = async ({
    lectureCount = 1,
    sectionCount = 1,
    lectureIndex = 0,
} = {}) => {
    const scenario = await createCourseProgressScenario({
        lectureCount,
        sectionCount,
    });

    const lecture = scenario.lectures[lectureIndex];

    if (!lecture) {
        throw new Error(`Lecture at index ${lectureIndex} does not exist.`);
    }

    const progress = await makeTestLectureProgressExists({
        studentId: scenario.user._id,
        courseId: scenario.course._id,
        lectureId: lecture._id,
        lastPosition: lecture.video.duration,
        watchedDuration: lecture.video.duration,
        isCompleted: true,
    });

    return {
        ...scenario,
        lecture,
        lectureProgress: progress.lectures.at(-1),
    };
};

export {
    createEnrolledCourseScenario,
    createCourseProgressScenario,
    createInitializedLectureProgressScenario,
    createCompletedLectureProgressScenario,
};
