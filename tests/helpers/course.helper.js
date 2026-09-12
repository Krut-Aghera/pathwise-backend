import Course from "../../src/features/course/course.model.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";

///////////////////////////////////////////////////////////////
// create test course

const createTestCourse = async ({ instructorId }) => {
    return Course.create({
        instructor: instructorId,
        title: `Test Course ${Date.now()}`,
        subtitle: "Test course subtitle",
        slug: `test-course-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
        description: "Test course description.",
        price: 999,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestCourse };
