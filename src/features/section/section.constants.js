///////////////////////////////////////////////////////////////
// section success messages

const SECTION_SUCCESS_MESSAGES = Object.freeze({
    SECTION_CREATED: "Section created successfully.",
    SECTION_UPDATED: "Section updated successfully.",

    SECTION_DELETED: "Section deleted successfully.",
    SECTIONS_REORDERED: "Sections reordered successfully.",

    SECTION_PUBLISHED: "Section published successfully.",
    SECTION_SAVED_AS_DRAFT: "Section saved as draft successfully.",

    SECTION_FETCHED: "Section fetched successfully.",
    SECTIONS_FETCHED: "Sections fetched successfully.",
});

///////////////////////////////////////////////////////////////
// section error messages

const SECTION_ERROR_MESSAGES = Object.freeze({
    SECTION_NOT_FOUND: "Section not found.",
    SECTION_ALREADY_DRAFT: "Section is already saved as draft.",

    DUPLICATE_SECTION_IDS: "Duplicate section IDs are not allowed.",
    SECTION_NOT_DRAFT: "Only a draft section can be published.",

    SECTION_NOT_ELIGIBLE_FOR_PUBLISH:
        "Section must have at least one published lecture before it can be published.",

    INVALID_SECTION_REORDER_PAYLOAD: "Invalid section reorder payload.",
    DUPLICATE_SECTION_ORDERS: "Duplicate section orders are not allowed.",
    SECTION_ORDERS_MUST_BE_SEQUENTIAL:
        "Section orders must start from 1 and be sequential.",
});

///////////////////////////////////////////////////////////////
// allowed course field constants

const SECTION_UPDATE_FIELDS = ["title"];

///////////////////////////////////////////////////////////////
// exports

export {
    SECTION_SUCCESS_MESSAGES,
    SECTION_ERROR_MESSAGES,
    SECTION_UPDATE_FIELDS,
};
