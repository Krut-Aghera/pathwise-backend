import express from "express";

import lectureInstructorRouter from "./lecture.instructor.routes.js";
import lectureStudentRouter from "./lecture.student.routes.js";

///////////////////////////////////////////////////////////////
// create router

const lectureRouter = express.Router();

///////////////////////////////////////////////////////////////
// mount private routes

lectureRouter.use("/students", lectureStudentRouter);
lectureRouter.use("/instructors", lectureInstructorRouter);

///////////////////////////////////////////////////////////////
// export

export default lectureRouter;
