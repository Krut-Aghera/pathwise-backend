import express from "express";

import sectioninstructorRouter from "./section.Instructor.routes.js";

const sectionRouter = express.Router();

sectionRouter.use(sectioninstructorRouter);

export default sectionRouter;
