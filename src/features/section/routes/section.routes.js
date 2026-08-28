import express from "express";

import sectioninstructorRouter from "./section.instructor.routes.js";

const sectionRouter = express.Router();

sectionRouter.use(sectioninstructorRouter);

export default sectionRouter;
