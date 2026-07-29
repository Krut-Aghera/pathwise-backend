import Lecture from "../lecture/lecture.model.js";

///////////////////////////////////////////////////////////////
// count section lectures repository

const countSectionLectures = ({ sectionId }) => {
    return Lecture.countDocuments({
        section: sectionId,
        isDeleted: false,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { countSectionLectures };
