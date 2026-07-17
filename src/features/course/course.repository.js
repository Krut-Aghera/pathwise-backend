import Course from "./course.model.js";

///////////////////////////////////////////////////////////////
// create course

const createCourse = async (courseData) => {
    return await Course.create(courseData);
};
