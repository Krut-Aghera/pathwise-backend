import Course from "./course.model.js";

///////////////////////////////////////////////////////////////
// create course

const createCourse = (courseData) => {
    return Course.create(courseData);
};

///////////////////////////////////////////////////////////////
// save course

const saveCourse = (course, validateBeforeSave = false) => {
    return course.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// find course by id

const findCourseById = (id) => {
    return Course.findById(id);
};

///////////////////////////////////////////////////////////////
// find instructor course by id
const findInstructorCourseById = ({ courseId, instructorId }) => {
    return Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });
};

///////////////////////////////////////////////////////////////
// find course by slug

const findCourseBySlug = (slug) => {
    return Course.findOne({ slug });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createCourse,
    saveCourse,
    findInstructorCourseById,
    findCourseById,
    findCourseBySlug,
};
