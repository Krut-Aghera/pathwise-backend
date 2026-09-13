import { COURSE_LIST_SELECT_FIELDS } from "../course/course.constants.js";
import Enrollment from "./enrollment.model.js";

///////////////////////////////////////////////////////////////
// create enrollment

const createEnrollment = ({ enrollmentPayload }) => {
    return Enrollment.create(enrollmentPayload);
};

///////////////////////////////////////////////////////////////
// find enrollment by student and course

const findEnrollment = ({ studentId, courseId }) => {
    return Enrollment.findOne({
        student: studentId,
        course: courseId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find enrollment by ID

const findEnrollmentById = ({ enrollmentId }) => {
    return Enrollment.findOne({
        _id: enrollmentId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find all enrollments for student

const findEnrollmentsByStudent = ({ studentId }) => {
    return Enrollment.find({
        student: studentId,
        isDeleted: false,
    })
        .populate({
            path: "course",
            select: COURSE_LIST_SELECT_FIELDS,
        })
        .sort({ enrolledAt: -1 });
};

///////////////////////////////////////////////////////////////
// find enrollment by student and enrollment ID

const findStudentEnrollmentById = ({ studentId, enrollmentId }) => {
    return Enrollment.findOne({
        _id: enrollmentId,
        student: studentId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// find all enrollments for course

const findEnrollmentsByCourse = ({ courseId }) => {
    return Enrollment.find({
        course: courseId,
        isDeleted: false,
    })
        .populate("student")
        .sort({ enrolledAt: -1 });
};

///////////////////////////////////////////////////////////////
// find all enrollments

const findAllEnrollments = () => {
    return Enrollment.find({
        isDeleted: false,
    })
        .populate("student")
        .populate("course")
        .sort({ enrolledAt: -1 });
};

///////////////////////////////////////////////////////////////
// exports

export {
    createEnrollment,
    findEnrollment,
    findEnrollmentById,
    findEnrollmentsByStudent,
    findStudentEnrollmentById,
    findEnrollmentsByCourse,
    findAllEnrollments,
};
