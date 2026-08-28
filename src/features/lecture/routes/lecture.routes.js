import express from "express";

import lectureInstructorRouter from "./lecture.instructor.routes.js";
import lectureAuthenticatedUser from "./lecture.authenticatedUser.routes.js";

const lectureRouter = express.Router();

lectureRouter.use(lectureAuthenticatedUser);
lectureRouter.use(lectureInstructorRouter);

export default lectureRouter;
