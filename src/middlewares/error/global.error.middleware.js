import multer from "multer";
import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { DUPLICATE_KEY_MESSAGES } from "./error.constants.js";
import { AUTH_ERROR_CODES } from "../../features/auth/auth.constants.js";

///////////////////////////////////////////////////////////////
// global error middleware

const globalErrorMiddleware = (err, req, res, next) => {
    logger.error("Global error middleware triggered 💥");

    // ------------ Mongoose Errors ------------

    if (err.name === "CastError") {
        err = new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    if (err.name === "ValidationError") {
        err = new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Validation failed",
            errors: Object.values(err.errors).map((error) => ({
                field: error.path,
                message: error.message,
            })),
        });
    }

    if (err.code === 11000) {
        const duplicateKey = Object.keys(err.keyPattern).join(",");

        err = new ApiError({
            statusCode: HTTP_STATUS.CONFLICT,
            message:
                DUPLICATE_KEY_MESSAGES[duplicateKey] ??
                "A resource with the same unique value already exists.",
        });
    }

    // ------------ JWT Errors ------------

    if (err.name === "JsonWebTokenError") {
        err = new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        err = new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            code: AUTH_ERROR_CODES.ACCESS_TOKEN_EXPIRED,
            message: "Token has expired",
        });
    }

    if (err.name === "NotBeforeError") {
        err = new ApiError({
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            message: "Token is not active yet",
        });
    }

    // ------------ Multer Errors ------------

    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                err = new ApiError({
                    statusCode: HTTP_STATUS.PAYLOAD_TOO_LARGE,
                    message:
                        "The uploaded file exceeds the maximum allowed size.",
                });
                break;

            case "LIMIT_FILE_COUNT":
                err = new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: "Only one file can be uploaded.",
                });
                break;

            case "LIMIT_UNEXPECTED_FILE":
                err = new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: `Unexpected upload field: ${err.field}.`,
                });
                break;

            case "LIMIT_PART_COUNT":
                err = new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: "Too many parts in the multipart request.",
                });
                break;

            case "LIMIT_FIELD_COUNT":
                err = new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: "Too many form fields were submitted.",
                });
                break;

            default:
                err = new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message: err.message || "File upload failed.",
                });
        }
    }

    // ------------ custom / unknown Errors ------------

    const isApiError = err instanceof ApiError;

    const statusCode = isApiError
        ? err.statusCode
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const message = isApiError ? err.message : "Internal Server Error";

    logger.error(
        {
            err,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
            },
        },
        message
    );

    return res.status(statusCode).json({
        success: false,
        statusCode,
        code: isApiError ? err.code : null,
        message,
        errors: isApiError ? err.errors : [],
        timestamp: new Date().toISOString(),

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            details: isApiError ? err.details : undefined,
        }),
    });
};

///////////////////////////////////////////////////////////////
// export

export default globalErrorMiddleware;
