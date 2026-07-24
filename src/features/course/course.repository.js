import mongoose from "mongoose";
import Course from "./course.model.js";
import { COURSE_STATUS } from "./course.constans.js";

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const createCourse = (courseData) => {
    return Course.create(courseData);
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const saveCourse = (course, validateBeforeSave = false) => {
    return course.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// publish course

const publishCourse = async (courseId) => {
    return Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                status: COURSE_STATUS.PUBLISHED,
                publishedAt: new Date(),
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const findCourseById = (courseId) => {
    return Course.findById(courseId);
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const findInstructorCourseById = ({ courseId, instructorId }) => {
    return Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const findCourseBySlug = (slug) => {
    return Course.findOne({ slug });
};

///////////////////////////////////////////////////////////////
// fetch course publish validation data
const getCoursePublishValidationData = async ({ courseId, instructorId }) => {
    return Course.aggregate([
        // Find the course and verify it belongs to the instructor
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
                instructor: new mongoose.Types.ObjectId(instructorId),
            },
        },

        // Keep only the fields required for publish validation
        {
            $project: {
                _id: 1,
                status: 1,
            },
        },

        // Fetch all sections of this course
        {
            $lookup: {
                from: "sections",

                // Store current course id for use inside the lookup pipeline
                let: {
                    courseId: "$_id",
                },

                pipeline: [
                    // Find sections that belong to this course
                    {
                        $match: {
                            $expr: {
                                $eq: ["$course", "$$courseId"],
                            },
                        },
                    },

                    // Return sections in the correct order
                    {
                        $sort: {
                            order: 1,
                        },
                    },

                    // Keep only required section fields
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                        },
                    },

                    // Fetch lectures for each section
                    {
                        $lookup: {
                            from: "lectures",

                            // Store current section id for use inside the lookup pipeline
                            let: {
                                sectionId: "$_id",
                            },

                            pipeline: [
                                // Find lectures that belong to this section
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$section", "$$sectionId"],
                                        },
                                    },
                                },

                                // Return lectures in the correct order
                                {
                                    $sort: {
                                        order: 1,
                                    },
                                },

                                // Keep only fields needed for publish validation
                                {
                                    $project: {
                                        title: 1,
                                        video: 1,
                                        duration: 1,
                                        uploadStatus: 1,
                                    },
                                },
                            ],

                            // Attach lectures to the current section
                            as: "lectures",
                        },
                    },
                ],

                // Attach sections to the course
                as: "sections",
            },
        },
    ]);
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

export {
    createCourse,
    saveCourse,
    publishCourse,
    findInstructorCourseById,
    findCourseById,
    findCourseBySlug,
    getCoursePublishValidationData,
};
