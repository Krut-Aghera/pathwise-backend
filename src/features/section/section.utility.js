import ApiError from "../../utils/error-handler.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { SECTION_ERROR_MESSAGES } from "./section.constants.js";

import * as sectionRepository from "./section.repository.js";
import * as lectureRepository from "../lecture/lecture.repository.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

//////////////////////////////////////////////////////////////
// get authorized instructor section

const getAuthorizedInstructorSection = async ({ sectionId, instructorId }) => {
    const section = await sectionRepository.findInstructorSection({
        sectionId,
        instructorId,
    });

    if (!section || !section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: SECTION_ERROR_MESSAGES.SECTION_NOT_FOUND,
        });
    }

    return section;
};

///////////////////////////////////////////////////////////////
// check if course has a published section

const hasPublishedSection = async ({ courseId }) => {
    return Boolean(
        await sectionRepository.existsPublishedSectionByCourse({
            courseId,
        })
    );
};

///////////////////////////////////////////////////////////////
// reconcile section publication
//
// A published section must have at least one
// published, non-deleted lecture.
//
// If no published lecture remains, the section is
// automatically moved from PUBLISHED to DRAFT.
//
// Returns:
// - updated section when status changes
// - null when section remains published

const reconcileSectionPublication = async ({ sectionId }) => {
    const hasPublishedLecture =
        await lectureRepository.existsPublishedLectureBySection({
            sectionId,
        });

    if (hasPublishedLecture) {
        return null;
    }

    return sectionRepository.updateSectionStatus({
        sectionId,
        currentStatus: RESOURCE_STATUS.PUBLISHED,
        nextStatus: RESOURCE_STATUS.DRAFT,
    });
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
                message: SECTION_ERROR_MESSAGES.DUPLICATE_SECTION_IDS,
            });
        }

        if (orders.has(order)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: SECTION_ERROR_MESSAGES.DUPLICATE_SECTION_ORDERS,
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
                message:
                    SECTION_ERROR_MESSAGES.SECTION_ORDERS_MUST_BE_SEQUENTIAL,
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
            message: SECTION_ERROR_MESSAGES.INVALID_SECTION_REORDER_PAYLOAD,
        });
    }

    const courseSectionIds = new Set(
        courseSections.map((section) => section._id.toString())
    );

    for (const { sectionId } of sections) {
        if (!courseSectionIds.has(sectionId)) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: SECTION_ERROR_MESSAGES.INVALID_SECTION_REORDER_PAYLOAD,
            });
        }
    }
};

///////////////////////////////////////////////////////////////
// exports

export {
    getAuthorizedInstructorSection,
    hasPublishedSection,
    reconcileSectionPublication,
    validateSectionReorderPayload,
    validateCourseSectionReorder,
};
