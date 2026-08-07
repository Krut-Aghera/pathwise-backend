import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import authRouter from "./features/auth/routes/auth.routes.js";
import userRouter from "./features/user/routes/user.routes.js";
import courseRouter from "./features/course/routes/course.routes.js";
import sectionRouter from "./features/section/routes/section.routes.js";
import lectureRouter from "./features/lecture/routes/lecture.routes.js";
import { serverAppConfig } from "./config/env.config.js";
import morganLogger from "./config/morgan.config.js";
import helmetMiddleware from "./middlewares/helmet.middleware.js";
import { globalRateLimiter } from "./middlewares/ratelimiter/limiters/global.ratelimit.js";
import globalErrorMiddleware from "./middlewares/error/global.error.middleware.js";
import notFoundErrorMiddleware from "./middlewares/error/not-found.error.middleware.js";

const app = express();

///////////////////////////////////////////////////////////////
// security middleware

app.use(helmetMiddleware);
app.use(hpp());
app.use(
    cors({
        origin: serverAppConfig?.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

///////////////////////////////////////////////////////////////
// Global rate limiter

app.use(globalRateLimiter);

///////////////////////////////////////////////////////////////
// morgan middleware for logs

if (serverAppConfig?.NODE_ENV === "development") {
    app.use(morganLogger);
}

///////////////////////////////////////////////////////////////
// express middlewares

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(cookieParser());

///////////////////////////////////////////////////////////////
// route middleware

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/lectures", lectureRouter);

///////////////////////////////////////////////////////////////
// error middlewares

app.use(notFoundErrorMiddleware);
app.use(globalErrorMiddleware);

///////////////////////////////////////////////////////////////
// export

export default app;
