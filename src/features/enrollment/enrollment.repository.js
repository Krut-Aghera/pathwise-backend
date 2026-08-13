import Enrollment from "./enrollment.model.js";

///////////////////////////////////////////////////////////////
// create enrollment

const createEnrollment = ({ enrollmentPayload }) => {
    return Enrollment.create(enrollmentPayload);
};

///////////////////////////////////////////////////////////////
// find enrollment

const findEnrollment = ({ studentId, courseId }) => {
    return Enrollment.findOne({
        student: studentId,
        course: courseId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createEnrollment, findEnrollment };
