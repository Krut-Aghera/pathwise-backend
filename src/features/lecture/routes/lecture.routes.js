import express from "express";

import lectureInstructorRouter from "./lecture.instructor.routes.js";
import lectureStudentRouter from "./lecture.student.routes.js";

const lectureRouter = express.Router();

lectureRouter.use(lectureStudentRouter);
lectureRouter.use(lectureInstructorRouter);

export default lectureRouter;
