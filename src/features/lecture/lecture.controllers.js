import * as lectureService from "./lecture.service.js";
import { LECTURE_ALLOWED_FIELDS } from "./lecture.constants";
import HTTP_STATUS from "../../constants/http.constants.js";
import ApiResponse from "../../utils/response-handler.utility.js";

///////////////////////////////////////////////////////////////
// create lecture controller

const createLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// update lecture controller

const updateLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// remove lecture controller

const removeLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// reorder lectures controller

const reorderLectures = async (req, res) => {};

///////////////////////////////////////////////////////////////
// update lecture video controller

const updateLectureVideo = async (req, res) => {};

///////////////////////////////////////////////////////////////
// remove lecture video controller

const removeLectureVideo = async (req, res) => {};

///////////////////////////////////////////////////////////////
// publish lecture controller

const publishLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// save lecture as draft controller

const saveLectureAsDraft = async (req, res) => {};

///////////////////////////////////////////////////////////////
// fetch instructor lecture controller

const fetchInstructorLecture = async (req, res) => {};

///////////////////////////////////////////////////////////////
// fetch instructor section lectures controller

const fetchSectionLectures = async (req, res) => {};

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
