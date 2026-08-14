///////////////////////////////////////////////////////////////
// wishlist success messages

const WISHLIST_SUCCESS_MESSAGES = {
    ADDED: "Course has been added to your wishlist.",
    REMOVED: "Course has been removed from your wishlist.",
    FETCHED: "Wishlist has been fetched.",
    CLEARED: "Wishlist has been cleared.",
};

///////////////////////////////////////////////////////////////
// wishlist error messages

const WISHLIST_ERROR_MESSAGES = {
    WISHLIST_NOT_FOUND: "Wishlist not found.",
};

///////////////////////////////////////////////////////////////
// wishlist course populate fields

const WISHLIST_COURSE_FIELDS = "title slug thumbnail price instructor";
const WISHLIST_INSTRUCTOR_FIELDS = "username";

///////////////////////////////////////////////////////////////
// exports

export {
    WISHLIST_SUCCESS_MESSAGES,
    WISHLIST_ERROR_MESSAGES,
    WISHLIST_COURSE_FIELDS,
    WISHLIST_INSTRUCTOR_FIELDS,
};
