import Section from "../../src/features/section/section.model.js";
import { RESOURCE_STATUS } from "../../src/constants/resource.constants";

///////////////////////////////////////////////////////////////
// create test section

const createTestSection = async ({ courseId, order = 1 }) => {
    return Section.create({
        course: courseId,
        title: `Test Progress Section ${Date.now()}`,
        order,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestSection };
