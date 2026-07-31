import * as lectureRepository from "./lecture.repository.js";
import { getAuthorizedInstructorSection } from "../section/section.utility";
import { getAuthorizedInstructorLecture } from "./lecture.utility.js";

///////////////////////////////////////////////////////////////
// create lecture service

const createLecture = async ({ instructorId, sectionId, lectureData }) => {
    await getAuthorizedInstructorSection({
        instructorId,
        sectionId,
    });

    const lastOrder = await lectureRepository.findLastLectureOrder({
        sectionId,
    });

    const order = lastOrder ? lastOrder.order + 1 : 1;

    const lecturePayload = {
        section: sectionId,
        ...lectureData,
        order,
    };

    return lectureRepository.createLecture({ lecturePayload });
};

///////////////////////////////////////////////////////////////
// update lecture service

const updateLecture = async ({ instructorId, lectureId, lectureData }) => {
    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
        includeSection: true,
    });

    Object.assign(lecture, lectureData);

    return lectureRepository.saveLecture({
        lecture,
        validateBeforeSave: true,
    });
};

///////////////////////////////////////////////////////////////
// remove lecture service

const removeLecture = async ({ instructorId, lectureId }) => {
    const lecture = await getAuthorizedInstructorLecture({
        lectureId,
        instructorId,
    });

    lecture.isDeleted = true;

    return lectureRepository.saveLecture({
        lecture,
    });
};

///////////////////////////////////////////////////////////////
// reorder lectures service

const reorderLectures = async ({}) => {};

///////////////////////////////////////////////////////////////
// update lecture video service

const updateLectureVideo = async ({}) => {};

///////////////////////////////////////////////////////////////
// remove lecture video service

const removeLectureVideo = async ({}) => {};

///////////////////////////////////////////////////////////////
// publish lecture service

const publishLecture = async ({}) => {};

///////////////////////////////////////////////////////////////
// save lecture as draft service

const saveLectureAsDraft = async ({}) => {};

///////////////////////////////////////////////////////////////
// fetch instructor lecture service

const fetchInstructorLecture = async ({}) => {};

///////////////////////////////////////////////////////////////
// fetch instructor lectures service

const fetchSectionLectures = async ({}) => {};

export {
    createLecture,
    updateLecture,
    removeLecture,
    reorderLectures,
    updateLectureVideo,
    removeLectureVideo,
    publishLecture,
    saveLectureAsDraft,
    fetchInstructorLecture,
    fetchSectionLectures,
};
