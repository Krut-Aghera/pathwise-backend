///////////////////////////////////////////////////////////////
// lecture allowed fields

const LECTURE_ALLOWED_FIELDS = ["title", "description", "isPreviewFree"];

///////////////////////////////////////////////////////////////
// lecture response message

const LECTURE_SUCCESS_MESSAGES = {
    CREATED: "Lecture has been created.",
    UPDATED: "Lecture has been updated.",
    DELETED: "Lecture has been deleted.",

    FETCHED: "Lecture has been fetched.",
    FETCHED_ALL: "Lectures have been fetched.",

    PUBLISHED: "Lecture has been published.",
    SAVED_AS_DRAFT: "Lecture has been saved as draft.",

    VIDEO_UPLOADED: "Lecture video uploaded successfully.",
    VIDEO_REMOVED: "Lecture video has been removed.",

    REORDERED: "Lectures have been reordered.",
};

///////////////////////////////////////////////////////////////
// lecture error message

const LECTURE_ERROR_MESSAGES = {
    NOT_FOUND: "Lecture not found.",
    VIDEO_REQUIRED: "Lecture video is required.",
    VIDEO_NOT_FOUND: "Lecture video not found.",
    VIDEO_UPLOAD_FAILED: "Failed to upload lecture video.",

    INVALID_LECTURE_REORDER_PAYLOAD: "Invalid lecture reorder payload.",
    DUPLICATE_LECTURE_IDS: "Duplicate lecture IDs are not allowed.",
    DUPLICATE_LECTURE_ORDERS: "Duplicate lecture orders are not allowed.",
    LECTURE_ORDERS_MUST_BE_SEQUENTIAL:
        "Lecture orders must start from 1 and be sequential.",

    VIDEO_ALREADY_EXISTS:
        "This lecture already has a video. Remove the existing video before uploading a new one.",
    LECTURE_NOT_ELIGIBLE_FOR_PUBLISH:
        "Lecture must have an uploaded video before it can be published.",
    LECTURE_NOT_DRAFT: "Only a draft lecture can be published.",
    LECTURE_ALREADY_DRAFT: "Lecture is already in draft.",
};

///////////////////////////////////////////////////////////////
// fetch lecture

const STUDENT_LECTURE_SELECT_FIELDS =
    "title description video isPreviewFree section order";

///////////////////////////////////////////////////////////////
// exports

export {
    LECTURE_ALLOWED_FIELDS,
    LECTURE_SUCCESS_MESSAGES,
    LECTURE_ERROR_MESSAGES,
    STUDENT_LECTURE_SELECT_FIELDS,
};
