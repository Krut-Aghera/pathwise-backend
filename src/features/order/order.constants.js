const ORDER_SUCCESS_MESSAGES = {
    CREATED: "Order created.",
    CANCELLED: "Order cancelled.",
};

///////////////////////////////////////////////////////////////
// order error messages

const ORDER_ERROR_MESSAGES = Object.freeze({
    ORDER_NOT_FOUND: "Order not found.",
    ORDER_ACCESS_DENIED: "You are not authorized to access this order.",
    ONLY_PENDING_ORDER_CAN_BE_CANCELLED:
        "Only a pending order can be cancelled.",
    CAN_NOT_PURCHASE: "Course is not available for purchase.",
});

///////////////////////////////////////////////////////////////
// order status constants

const ORDER_STATUS = Object.freeze({
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
});

const ORDER_STATUS_ARRAY = Object.values(ORDER_STATUS);

///////////////////////////////////////////////////////////////
// currency

const ORDER_CURRENCY = "INR";

///////////////////////////////////////////////////////////////
// allowed course field constants

const ORDER_ALLOWED_FIELDS = ["course"];

///////////////////////////////////////////////////////////////
// exports

export {
    ORDER_SUCCESS_MESSAGES,
    ORDER_ERROR_MESSAGES,
    ORDER_STATUS,
    ORDER_STATUS_ARRAY,
    ORDER_CURRENCY,
    ORDER_ALLOWED_FIELDS,
};
