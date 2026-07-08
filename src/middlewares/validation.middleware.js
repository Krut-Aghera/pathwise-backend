import { validationResult } from "express-validator";
import ApiError from "../utils/errorHandler.js";

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
            statusCode: 400,
            message: "Validation failed",
            errors: validationErrors,
        });
    }

    next();
};

export default validationEngine;
