class ApiError extends Error {
    constructor({
        statusCode,
        code,
        message = "Internal Server Error",
        errors = [],
        details = null,
        isOperational = true,
    }) {
        super(message);

        this.name = this.constructor.name;
        this.success = false;
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        this.details = details;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
