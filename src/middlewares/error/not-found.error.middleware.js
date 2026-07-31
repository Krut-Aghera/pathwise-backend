import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";

///////////////////////////////////////////////////////////////
// not found error middleware

const notFoundErrorMiddleware = (req, res, next) => {
    logger.error("404 middleware triggered 💥");

    next(
        new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: `Route ${req.originalUrl} not found`,
        })
    );
};

///////////////////////////////////////////////////////////////
// export

export default notFoundErrorMiddleware;
