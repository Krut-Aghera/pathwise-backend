import * as courseRepository from "./course.repository.js";

///////////////////////////////////////////////////////////////
// create course service

const createCourse = async (courseData) => {
    const existingCourse = await Course.findOne({
        title: courseData.title,
        slug: courseData.slug,
    });
    if (existingCourse) {
        throw new Error("Course with the same title and slug already exists");
    }

    const course = await courseRepository.createCourse(courseData);
    return course;
};

///////////////////////////////////////////////////////////////
// exports

export { createCourse };
