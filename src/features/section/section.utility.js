import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import * as sectionRepository from "./section.repository.js";

//////////////////////////////////////////////////////////////
// get authorized instructor section

const getAuthorizedInstructorSection = async ({
    sectionId,
    instructorId,
    includeCourse = false,
}) => {
    const section = await sectionRepository.findInstructorSection({
        sectionId,
        instructorId,
    });

    if (!section || !section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Section not found.",
        });
    }

    if (!includeCourse) {
        section.course = undefined;
    }

    return section;
};

///////////////////////////////////////////////////////////////
// validate section reorder payload

const validateSectionReorderPayload = ({ sections }) => {
    const sectionIds = new Set();
    const orders = new Set();

    for (const { sectionId, order } of sections) {
        if (sectionIds.has(sectionId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Duplicate section IDs are not allowed.",
            });
        }

        if (orders.has(order)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Duplicate section orders are not allowed.",
            });
        }

        sectionIds.add(sectionId);
        orders.add(order);
    }

    const sortedOrders = [...orders].sort((a, b) => a - b);

    for (let index = 0; index < sortedOrders.length; index++) {
        const expectedOrder = index + 1;

        if (sortedOrders[index] !== expectedOrder) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Section orders must start from 1 and be sequential.",
            });
        }
    }
};

///////////////////////////////////////////////////////////////
// validate course section reorder

const validateCourseSectionReorder = ({ sections, courseSections }) => {
    if (sections.length !== courseSections.length) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Invalid section reorder payload.",
        });
    }

    const courseSectionIds = new Set(
        courseSections.map((section) => section._id.toString())
    );

    for (const { sectionId } of sections) {
        if (!courseSectionIds.has(sectionId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: "Invalid section reorder payload.",
            });
        }
    }
};

///////////////////////////////////////////////////////////////
// exports

export {
    getAuthorizedInstructorSection,
    validateSectionReorderPayload,
    validateCourseSectionReorder,
};
