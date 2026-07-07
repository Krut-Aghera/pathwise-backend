import { validationResult } from "express-validator";

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

        throw newApiError(400, "Validation failed", validationErrors);
    }

    next();
};

export default validationEngine;
