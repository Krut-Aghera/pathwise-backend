import Enrollment from "./enrollment.model.js";

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

export {
    findEnrollment
}