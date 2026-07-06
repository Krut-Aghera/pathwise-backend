import express from "express";
import cors from "cors";
import morganLogger from "./config/morgan.config.js";
import { serverConfig } from "./config/env.config.js";
import { apiRateLimiter } from "./middlewares/ratelimit.middleware.js";
import { globalErrorMiddleware, notFoundErrorMiddleware } from "./middlewares/error.middleware.js";
import HTTP_STATUS from "./constants/http-status.js";
import ApiResponse from "./utils/responsehandler.js";

const app = express();

///////////////////////////////////////////////////////////////
// morgan middleware for logs

if (serverConfig?.NODE_ENV === "development") {
    app.use(morganLogger);
}

///////////////////////////////////////////////////////////////
// express middlewares

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

///////////////////////////////////////////////////////////////
// route middleware

// app.use("/api/v1", apiRateLimiter);

// testing route

app.get("/", (req, res) => {
    res.status(HTTP_STATUS.OK).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.OK,
            message: "home route is working fine",
        })
    );
});

app.get("/test", (req, res) => {
    res.status(HTTP_STATUS.ACCEPTED).json(
        new ApiResponse({
            statusCode: HTTP_STATUS.ACCEPTED,
            message: "test route is working fine",
        })
    );
});

///////////////////////////////////////////////////////////////
// error middlewares

app.use(notFoundErrorMiddleware);
app.use(globalErrorMiddleware);

export default app;
