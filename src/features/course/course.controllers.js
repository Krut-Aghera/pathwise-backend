import { COURSE_ALLOWED_FIELDS } from "./course-constans.js";
import HTTP_STATUS from "../../constants/http-status.js";
import apiResponse from "../../utils/responsehandler.js";
import * as courseService from "./course.service.js";

///////////////////////////////////////////////////////////////
// create course controller

const createCourse = async (req, res) => {
    const courseData = COURSE_ALLOWED_FIELDS.reduce((acc, field) => {
        if (req.body[field] !== undefined) {
            acc[field] = req.body[field];
        }
        return acc;
    }, {});

    const course = await courseService.createCourse(courseData);

    res.status(HTTP_STATUS.CREATED).json(
        new apiResponse({
            statusCode: HTTP_STATUS.CREATED,
            message: "Course created successfully",
            data: course,
        })
    );
};

///////////////////////////////////////////////////////////////
// exports

export { createCourse };
