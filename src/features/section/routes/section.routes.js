import express from "express";

import sectionInstructorRouter from "./section.instructor.routes.js";

const sectionRouter = express.Router();

sectionRouter.use(sectionInstructorRouter);

export default sectionRouter;
