import Course from "./course.model.js";

///////////////////////////////////////////////////////////////
// create course

const createCourse = async (courseData) => {
    return await Course.create(courseData);
};

///////////////////////////////////////////////////////////////
// find course by slug

const findCourseBySlug = async (slug) => {
    return await Course.findOne({ slug });
};

///////////////////////////////////////////////////////////////
// exports

export { createCourse, findCourseBySlug };
