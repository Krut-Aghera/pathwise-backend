import mongoose from "mongoose";
import Course from "./course.model.js";
import { COURSE_LIST_SELECT_FIELDS, SORT_ORDERS } from "./course.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

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
// soft delete course

const softDeleteCourse = (courseId) => {
    return Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                isDeleted: true,
                status: RESOURCE_STATUS.DRAFT,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// publish course

const publishCourse = async (courseId) => {
    return Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                status: RESOURCE_STATUS.PUBLISHED,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// Save course as draft

const saveCourseAsDraft = async (courseId) => {
    return Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                status: RESOURCE_STATUS.DRAFT,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// find courses

const findCourses = async (options) => {
    const { pagination, filters, sort, search } = options;

    const { by, order } = sort;
    const { page, limit } = pagination;

    const filterQuery = {
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    };

    Object.assign(filterQuery, filters);

    if (search) {
        const escapedSearch = escapeRegex(search);

        filterQuery.$or = [
            {
                title: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
            {
                subtitle: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
        ];
    }

    const sortQuery = {
        [by]: order === SORT_ORDERS.ASC ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [courses, totalItems] = await Promise.all([
        Course.find(filterQuery)
            .select(COURSE_LIST_SELECT_FIELDS)
            .populate("instructor", "username")
            .sort({
                ...sortQuery,
                _id: 1,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Course.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const itemsPerPage = limit;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
        courses,
        metadata: {
            pagination: {
                totalItems,
                currentPage,
                totalPages,
                itemsPerPage,
                hasNextPage,
                hasPreviousPage,
                nextPage: hasNextPage ? currentPage + 1 : null,
                previousPage: hasPreviousPage ? currentPage - 1 : null,
            },
        },
    };
};

///////////////////////////////////////////////////////////////
// find course by id

const findCourseById = (courseId) => {
    return Course.findOne({
        _id: courseId,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find course by slug

const findCourseBySlug = (slug) => {
    return Course.findOne({
        slug,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find instructor courses

const findInstructorCourses = async (options) => {
    const { instructor, page, limit } = options;

    const filterQuery = {
        instructor,
        isDeleted: false,
    };

    const skip = (page - 1) * limit;

    const [courses, totalItems] = await Promise.all([
        Course.find(filterQuery)
            .select(COURSE_LIST_SELECT_FIELDS)
            .populate("instructor", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Course.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const itemsPerPage = limit;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
        courses,
        metadata: {
            pagination: {
                totalItems,
                currentPage,
                totalPages,
                itemsPerPage,
                hasNextPage,
                hasPreviousPage,
                nextPage: hasNextPage ? currentPage + 1 : null,
                previousPage: hasPreviousPage ? currentPage - 1 : null,
            },
        },
    };
};

///////////////////////////////////////////////////////////////
// find instructor course by id

const findInstructorCourseById = ({ courseId, instructorId }) => {
    return Course.findOne({
        _id: courseId,
        instructor: instructorId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// fetch current course data

const fetchCurrentCourseData = (courseId) => {
    return Course.aggregate([
        // find published course
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
                status: RESOURCE_STATUS.PUBLISHED,
                isDeleted: false,
            },
        },

        // instructor details
        {
            $lookup: {
                from: "users",
                localField: "instructor",
                foreignField: "_id",
                as: "instructor",

                pipeline: [
                    {
                        $project: {
                            username: 1,
                            profilePicture: 1,
                        },
                    },
                ],
            },
        },

        {
            $unwind: "$instructor",
        },

        // sections + lectures
        {
            $lookup: {
                from: "sections",

                let: {
                    courseId: "$_id",
                },

                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$course", "$$courseId"],
                            },

                            status: RESOURCE_STATUS.PUBLISHED,
                            isDeleted: false,
                        },
                    },

                    {
                        $lookup: {
                            from: "lectures",

                            let: {
                                sectionId: "$_id",
                            },

                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$section", "$$sectionId"],
                                        },

                                        status: RESOURCE_STATUS.PUBLISHED,
                                        isDeleted: false,
                                    },
                                },

                                {
                                    $project: {
                                        title: 1,
                                        subtitle: 1,
                                        description: 1,
                                        duration: 1,
                                        thumbnail: 1,
                                        level: 1,
                                        isPreview: 1,
                                        order: 1,
                                    },
                                },

                                {
                                    $sort: {
                                        order: 1,
                                    },
                                },
                            ],

                            as: "lectures",
                        },
                    },

                    {
                        $project: {
                            title: 1,
                            order: 1,

                            lectures: 1,

                            lectureCount: {
                                $size: "$lectures",
                            },
                        },
                    },

                    {
                        $sort: {
                            order: 1,
                        },
                    },
                ],

                as: "sections",
            },
        },

        // enrollment statistics
        {
            $lookup: {
                from: "enrollments",

                let: {
                    courseId: "$_id",
                },

                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$course", "$$courseId"],
                            },

                            status: "ACTIVE",
                        },
                    },

                    {
                        $count: "totalEnrollments",
                    },
                ],

                as: "enrollmentStats",
            },
        },

        // rating statistics
        {
            $lookup: {
                from: "ratings",

                let: {
                    courseId: "$_id",
                },

                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$course", "$$courseId"],
                            },

                            isDeleted: false,
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            averageRating: {
                                $avg: "$rating",
                            },

                            totalRatings: {
                                $sum: 1,
                            },
                        },
                    },
                ],

                as: "ratingStats",
            },
        },

        // calculate course statistics
        {
            $addFields: {
                statistics: {
                    totalSections: {
                        $size: "$sections",
                    },

                    totalLectures: {
                        $sum: {
                            $map: {
                                input: "$sections",
                                as: "section",

                                in: "$$section.lectureCount",
                            },
                        },
                    },

                    totalDuration: {
                        $sum: {
                            $map: {
                                input: "$sections",
                                as: "section",

                                in: {
                                    $sum: {
                                        $map: {
                                            input: "$$section.lectures",
                                            as: "lecture",

                                            in: "$$lecture.duration",
                                        },
                                    },
                                },
                            },
                        },
                    },

                    totalEnrollments: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    "$enrollmentStats.totalEnrollments",
                                    0,
                                ],
                            },

                            0,
                        ],
                    },

                    averageRating: {
                        $ifNull: [
                            {
                                $arrayElemAt: ["$ratingStats.averageRating", 0],
                            },

                            0,
                        ],
                    },

                    totalRatings: {
                        $ifNull: [
                            {
                                $arrayElemAt: ["$ratingStats.totalRatings", 0],
                            },

                            0,
                        ],
                    },
                },
            },
        },

        // final response
        {
            $project: {
                title: 1,
                subtitle: 1,
                slug: 1,
                description: 1,

                price: 1,

                thumbnail: 1,

                language: 1,
                level: 1,

                learningOutcomes: 1,
                targetAudience: 1,
                requirements: 1,

                instructor: 1,

                statistics: 1,

                sections: 1,
            },
        },
    ]);
};

///////////////////////////////////////////////////////////////
// fetch course publish validation data

const fetchCoursePublishValidationData = async ({ courseId, instructorId }) => {
    return Course.aggregate([
        // Find the course and verify it belongs to the instructor
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
                instructor: new mongoose.Types.ObjectId(instructorId),
                isDeleted: false,
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
// exports

export {
    createCourse,
    saveCourse,
    softDeleteCourse,
    publishCourse,
    saveCourseAsDraft,
    findCourses,
    findCourseById,
    findCourseBySlug,
    findInstructorCourses,
    findInstructorCourseById,
    fetchCurrentCourseData,
    fetchCoursePublishValidationData,
};
