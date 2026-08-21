import { RESOURCE_STATUS } from "../../src/constants/resource.constants.js";
import Lecture from "../../src/features/lecture/lecture.model.js";

///////////////////////////////////////////////////////////////
// create test lecture

const createTestLecture = async ({ sectionId, order = 1 }) => {
    return await Lecture.create({
        section: sectionId,
        title: `Test Lecture ${Date.now()}`,
        description: "Test lecture for Progress API testing.",
        video: {
            publicId: `test-video-${Date.now()}`,
            url: "https://example.com/test-video.mp4",
            thumbnailUrl: "https://example.com/test-thumbnail.jpg",
            duration: 600,
            fileSize: 1000000,
            format: "mp4",
            width: 1280,
            height: 720,
        },
        isPreviewFree: false,
        order,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestLecture };
