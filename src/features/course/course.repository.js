import mongoose from "mongoose";

import { RESOURCE_STATUS } from "../../constants/resource.constants.js";

import { COURSE_LIST_SELECT_FIELDS, SORT_ORDERS } from "./course.constants.js";
import Course from "./course.model.js";
import escapeRegex from "../../utils/escape-regex.utility.js";

///////////////////////////////////////////////////////////////
// create course

const createCourse = ({ coursePayload }) => {
    return Course.create(coursePayload);
};

///////////////////////////////////////////////////////////////
// save course

const saveCourse = ({ course, validateBeforeSave = false }) => {
    return course.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// soft delete course

const softDeleteCourse = ({ courseId }) => {
    return Course.findOneAndUpdate(
        {
            _id: courseId,
            isDeleted: false,
        },
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
// update course status

const updateCourseStatus = ({
    courseId,
    instructorId,
    currentStatus,
    nextStatus,
}) => {
    return Course.findOneAndUpdate(
        {
            _id: courseId,
            instructor: instructorId,
            status: currentStatus,
            isDeleted: false,
        },
        {
            $set: {
                status: nextStatus,
            },
        },
        {
            returnDocument: "after",
        }
    );
};

///////////////////////////////////////////////////////////////
// update published course to draft

const updatePublishedCourseToDraft = ({ courseId }) => {
    return Course.findOneAndUpdate(
        {
            _id: courseId,
            status: RESOURCE_STATUS.PUBLISHED,
            isDeleted: false,
        },
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

const findCourses = async ({ options }) => {
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
// find published course

const findPublishedCourse = ({ courseId }) => {
    return Course.findOne({
        _id: courseId,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find course by slug

const findCourseBySlug = ({ slug }) => {
    return Course.findOne({
        slug,
        status: RESOURCE_STATUS.PUBLISHED,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find instructor courses

const findInstructorCourses = async ({ options }) => {
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
// find removed courses

const findRemovedCourses = async ({ instructorId }) => {
    return await Course.find(
        {
            instructor: instructorId,
            isDeleted: true,
        },
        {
            _id: 0,
            title: 1,
            subtitle: 1,
        }
    ).lean();
};


///////////////////////////////////////////////////////////////
// aggregate current course data

const aggregateCurrentCourseData = ({ courseId }) => {
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
                                        description: 1,
                                        duration: "$video.duration",
                                        isPreviewFree: 1,
                                        order: 1,

                                        video: {
                                            $cond: {
                                                if: "$isPreviewFree",
                                                then: "$video",
                                                else: "$$REMOVE",
                                            },
                                        },
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
// exports

export {
    createCourse,
    saveCourse,
    softDeleteCourse,
    updateCourseStatus,
    updatePublishedCourseToDraft,
    findCourses,
    findPublishedCourse,
    findCourseBySlug,
    findInstructorCourses,
    findInstructorCourseById,
    findRemovedCourses,
    aggregateCurrentCourseData,
};
