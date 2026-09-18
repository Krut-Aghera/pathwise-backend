import mongoose from "mongoose";

import User from "../user/user.model.js";
import Course from "../course/course.model.js";
import Order from "../order/order.model.js";
import Payment from "../payment/payment.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import Progress from "../progress/progress.model.js";

import { ROLES } from "../user/user.constants.js";
import { RESOURCE_STATUS } from "../../constants/resource.constants.js";
import { PAYMENT_STATUS } from "../payment/payment.constants.js";
import { PROGRESS_STATUS } from "../progress/progress.constants.js";

///////////////////////////////////////////////////////////////
// fetch instructor dashboard

const fetchInstructorDashboard = async ({ instructorId }) => {
    const instructorObjectId = new mongoose.Types.ObjectId(instructorId);

    ///////////////////////////////////////////////////////////////
    // run independent dashboard queries in parallel
    //
    // Course statistics, enrollment statistics, and revenue
    // statistics are independent of each other.

    const [courseStatsData, enrollmentData, revenueData] = await Promise.all([
        ///////////////////////////////////////////////////////////
        // course statistics

        Course.aggregate([
            {
                $match: {
                    instructor: instructorObjectId,
                },
            },

            {
                $group: {
                    _id: null,

                    totalPublishedCourses: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $eq: [
                                                "$status",
                                                RESOURCE_STATUS.PUBLISHED,
                                            ],
                                        },
                                        {
                                            $eq: ["$isDeleted", false],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    totalDraftCourses: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $eq: [
                                                "$status",
                                                RESOURCE_STATUS.DRAFT,
                                            ],
                                        },
                                        {
                                            $eq: ["$isDeleted", false],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    totalDeletedCourses: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ["$isDeleted", true],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    totalPublishedCourses: 1,
                    totalDraftCourses: 1,
                    totalDeletedCourses: 1,
                },
            },
        ]),

        ///////////////////////////////////////////////////////////
        // enrollment statistics
        //
        // Start from instructor courses because the Course
        // collection has an index beginning with instructor and
        // Enrollment has an index beginning with course.

        Course.aggregate([
            {
                $match: {
                    instructor: instructorObjectId,
                },
            },

            {
                $lookup: {
                    from: Enrollment.collection.name,
                    localField: "_id",
                    foreignField: "course",
                    pipeline: [
                        {
                            $match: {
                                isDeleted: false,
                            },
                        },

                        {
                            $count: "total",
                        },
                    ],
                    as: "enrollmentData",
                },
            },

            {
                $unwind: {
                    path: "$enrollmentData",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $group: {
                    _id: null,

                    totalEnrollments: {
                        $sum: {
                            $ifNull: ["$enrollmentData.total", 0],
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    totalEnrollments: 1,
                },
            },
        ]),

        ///////////////////////////////////////////////////////////
        // revenue statistics
        //
        // Start from instructor courses and use the existing
        // Order.course and Payment.order indexes for the joins.
        //
        // Deleted courses remain included intentionally because
        // historical revenue must continue to be counted.

        Course.aggregate([
            {
                $match: {
                    instructor: instructorObjectId,
                },
            },

            {
                $lookup: {
                    from: Order.collection.name,
                    localField: "_id",
                    foreignField: "course",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                            },
                        },

                        {
                            $lookup: {
                                from: Payment.collection.name,
                                localField: "_id",
                                foreignField: "order",
                                pipeline: [
                                    {
                                        $match: {
                                            status: PAYMENT_STATUS.SUCCESS,
                                        },
                                    },

                                    {
                                        $project: {
                                            _id: 0,
                                            amount: 1,
                                        },
                                    },
                                ],
                                as: "payment",
                            },
                        },

                        {
                            $unwind: "$payment",
                        },

                        {
                            $project: {
                                _id: 0,
                                amount: "$payment.amount",
                            },
                        },
                    ],
                    as: "revenueData",
                },
            },

            {
                $unwind: {
                    path: "$revenueData",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $group: {
                    _id: null,

                    totalRevenue: {
                        $sum: {
                            $ifNull: ["$revenueData.amount", 0],
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                },
            },
        ]),
    ]);

    ///////////////////////////////////////////////////////////////
    // normalize aggregation results

    const courseStats = courseStatsData[0] || {
        totalPublishedCourses: 0,
        totalDraftCourses: 0,
        totalDeletedCourses: 0,
    };

    const totalEnrollments = enrollmentData[0]?.totalEnrollments || 0;

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    ///////////////////////////////////////////////////////////////
    // return dashboard response

    return {
        totalPublishedCourses: courseStats.totalPublishedCourses,
        totalDraftCourses: courseStats.totalDraftCourses,
        totalDeletedCourses: courseStats.totalDeletedCourses,
        totalEnrollments,
        totalRevenue,
    };
};

///////////////////////////////////////////////////////////////
// fetch student dashboard

const fetchStudentDashboard = async ({ studentId }) => {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const [dashboard] = await Enrollment.aggregate([
        ///////////////////////////////////////////////////////////////
        // match active enrollments belonging to the student

        {
            $match: {
                student: studentObjectId,
                isDeleted: false,
            },
        },

        ///////////////////////////////////////////////////////////////
        // lookup progress for each enrolled course

        {
            $lookup: {
                from: Progress.collection.name,
                let: {
                    studentId: "$student",
                    courseId: "$course",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$student", "$$studentId"],
                                    },
                                    {
                                        $eq: ["$course", "$$courseId"],
                                    },
                                ],
                            },
                        },
                    },

                    {
                        $project: {
                            _id: 0,
                            status: 1,
                        },
                    },
                ],
                as: "progress",
            },
        },

        ///////////////////////////////////////////////////////////////
        // calculate dashboard statistics

        {
            $group: {
                _id: null,

                totalEnrolledCourses: {
                    $sum: 1,
                },

                totalCompletedCourses: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    {
                                        $arrayElemAt: ["$progress.status", 0],
                                    },
                                    PROGRESS_STATUS.COMPLETED,
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },

        ///////////////////////////////////////////////////////////////
        // response shape

        {
            $project: {
                _id: 0,
                totalEnrolledCourses: 1,
                totalCompletedCourses: 1,
            },
        },
    ]);

    return (
        dashboard || {
            totalEnrolledCourses: 0,
            totalCompletedCourses: 0,
        }
    );
};

///////////////////////////////////////////////////////////////
// fetch admin dashboard

const fetchAdminDashboard = async () => {
    ///////////////////////////////////////////////////////////////
    // run independent dashboard queries in parallel

    const [
        instructorData,
        studentData,
        enrollmentData,
        revenueData,
        courseData,
    ] = await Promise.all([
        ///////////////////////////////////////////////////////////
        // active instructors

        User.aggregate([
            {
                $match: {
                    role: ROLES.INSTRUCTOR,
                    isActive: true,
                },
            },

            {
                $project: {
                    _id: 0,
                    name: "$username",
                },
            },
        ]),

        ///////////////////////////////////////////////////////////
        // active students

        User.aggregate([
            {
                $match: {
                    role: ROLES.STUDENT,
                    isActive: true,
                },
            },

            {
                $project: {
                    _id: 0,
                    name: "$username",
                },
            },
        ]),

        ///////////////////////////////////////////////////////////
        // total active enrollments

        Enrollment.countDocuments({
            isDeleted: false,
        }),

        ///////////////////////////////////////////////////////////
        // total successful payment revenue

        Payment.aggregate([
            {
                $match: {
                    status: PAYMENT_STATUS.SUCCESS,
                },
            },

            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount",
                    },
                },
            },
        ]),

        ///////////////////////////////////////////////////////////
        // course statistics
        //
        // Active courses are fetched once with their instructor.
        // Draft and published course lists are derived from the
        // same active-course result instead of performing separate
        // instructor lookups.

        Course.aggregate([
            {
                $facet: {
                    ///////////////////////////////////////////////////
                    // active courses

                    activeCourses: [
                        {
                            $match: {
                                isDeleted: false,
                            },
                        },

                        {
                            $lookup: {
                                from: User.collection.name,
                                localField: "instructor",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            username: 1,
                                        },
                                    },
                                ],
                                as: "instructor",
                            },
                        },

                        {
                            $unwind: "$instructor",
                        },

                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                subtitle: 1,
                                price: 1,
                                status: 1,
                                instructor: "$instructor.username",
                            },
                        },
                    ],

                    ///////////////////////////////////////////////////
                    // removed courses
                    //
                    // Removed courses do not need an instructor
                    // lookup because the response only contains
                    // course identification information.

                    removedCourses: [
                        {
                            $match: {
                                isDeleted: true,
                            },
                        },

                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                subtitle: 1,
                            },
                        },
                    ],
                },
            },

            ///////////////////////////////////////////////////////////
            // calculate admin course statistics from the two
            // already-fetched course collections

            {
                $project: {
                    totalCourses: {
                        $size: "$activeCourses",
                    },

                    courses: {
                        $map: {
                            input: "$activeCourses",
                            as: "course",
                            in: {
                                _id: "$$course._id",
                                title: "$$course.title",
                                subtitle: "$$course.subtitle",
                                price: "$$course.price",
                                instructor: "$$course.instructor",
                            },
                        },
                    },

                    totalRemovedCourses: {
                        $size: "$removedCourses",
                    },

                    removedCourses: "$removedCourses",

                    draftCourses: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$activeCourses",
                                    as: "course",
                                    cond: {
                                        $eq: [
                                            "$$course.status",
                                            RESOURCE_STATUS.DRAFT,
                                        ],
                                    },
                                },
                            },
                            as: "course",
                            in: {
                                _id: "$$course._id",
                                title: "$$course.title",
                                instructor: "$$course.instructor",
                            },
                        },
                    },

                    publishedCourses: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$activeCourses",
                                    as: "course",
                                    cond: {
                                        $eq: [
                                            "$$course.status",
                                            RESOURCE_STATUS.PUBLISHED,
                                        ],
                                    },
                                },
                            },
                            as: "course",
                            in: {
                                _id: "$$course._id",
                                title: "$$course.title",
                                instructor: "$$course.instructor",
                            },
                        },
                    },
                },
            },
        ]),
    ]);

    ///////////////////////////////////////////////////////////////
    // normalize course aggregation result

    const courseStats = courseData[0] || {
        totalCourses: 0,
        courses: [],
        totalRemovedCourses: 0,
        removedCourses: [],
        draftCourses: [],
        publishedCourses: [],
    };

    ///////////////////////////////////////////////////////////////
    // normalize revenue aggregation result

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    ///////////////////////////////////////////////////////////////
    // return dashboard response

    return {
        totalEnrollments: enrollmentData,

        totalInstructors: instructorData.length,
        instructors: instructorData,

        totalStudents: studentData.length,
        students: studentData,

        totalRevenue,

        totalCourses: courseStats.totalCourses,
        courses: courseStats.courses,

        totalRemovedCourses: courseStats.totalRemovedCourses,
        removedCourses: courseStats.removedCourses,

        draftCourses: courseStats.draftCourses,
        publishedCourses: courseStats.publishedCourses,
    };
};

///////////////////////////////////////////////////////////////
// repository exports

export { fetchInstructorDashboard, fetchStudentDashboard, fetchAdminDashboard };
