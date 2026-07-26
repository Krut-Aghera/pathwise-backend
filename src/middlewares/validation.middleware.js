import { validationResult } from "express-validator";
import ApiError from "../utils/error-handler.utility.js";
import HTTP_STATUS from "../constants/http-status.js";

const validationEngine = (req, res, next) => {
    const errors = validationResult(req);

    const hasErrors = !errors.isEmpty();

    if (hasErrors) {
        const validationErrors = errors.array().map((error) => {
            return {
                field: error.path,
                message: error.msg,
                value: error.value,
            };
        });

        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Validation failed",
            errors: validationErrors,
        });
    }

    next();
};

export default validationEngine;
