import express from "express";

import coursePublicRouter from "./course.public.routes.js";
import coursePrivateRouter from "./course.private.routes.js";

///////////////////////////////////////////////////////////////
// create router

const courseRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount instructor routes

courseRouter.use("/instructor", coursePrivateRouter);

///////////////////////////////////////////////////////////////
// mount public routes

courseRouter.use(coursePublicRouter);

///////////////////////////////////////////////////////////////
// export

export default courseRouter;
