import express from "express";

import coursePrivateRouter from "./course.private.routes.js";
import coursePublicRouter from "./course.public.routes.js";

const courseRouter = express.Router();

courseRouter.use(coursePrivateRouter);
courseRouter.use(coursePublicRouter);

export default courseRouter;
