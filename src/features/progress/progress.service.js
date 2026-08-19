import * as progressRepository from "./progress.repository.js";
import * as lectureRepository from "../lecture/lecture.repository.js";
import * as sectionRepository from "../section/section.repository.js";
import ApiError from "../../utils/error-handler.utility.js";
import HTTP_STATUS from "../../constants/http.constants.js";
import { PROGRESS_ERROR_MESSAGES } from "./progress.constants.js";
import {
    buildProgressCalculatedMeta,
    hasLectureReachedCompletionThreshold,
} from "./progress.utility.js";
import { LECTURE_ERROR_MESSAGES } from "../lecture/lecture.constants.js";

////////////////////////////////////////////////////////////////
// fetch course progress service

const fetchCourseProgress = async ({ studentId, courseId }) => {
    let progress = await progressRepository.findProgressByStudentAndCourse({
        studentId,
        courseId,
    });

    if (!progress) {
        progress = await progressRepository.createProgress({
            studentId,
            courseId,
        });
    }

    const sections = await sectionRepository.findSectionByCourse({
        courseId,
    });

    const sectionIds = sections.map(({ _id }) => _id);

    const publishedLectures =
        await lectureRepository.findPublishedLecturesBySections({
            sectionIds,
        });

    const meta = buildProgressCalculatedMeta({
        progress,
        lectures: publishedLectures,
    });

    return {
        progress,
        meta,
    };
};

////////////////////////////////////////////////////////////////
// initialize lecture progress

const initializeLectureProgress = async ({
    studentId,
    courseId,
    lectureId,
}) => {
    // find student course progress

    const progress = await progressRepository.findProgressByStudentAndCourse({
        studentId,
        courseId,
    });

    if (!progress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.PROGRESS_NOT_FOUND,
        });
    }

    // find published lecture

    const lecture = await lectureRepository.findPublishedLecture({
        lectureId,
    });

    if (
        !lecture ||
        lecture.section?.course?._id.toString() !== courseId.toString()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    // check existing lecture progress

    const existingLectureProgress = progress.lectures.find(
        ({ lecture }) => lecture.toString() === lectureId.toString()
    );

    // update existing lecture access

    let updatedProgress;

    if (existingLectureProgress) {
        updatedProgress = await progressRepository.updateLastAccessedLecture({
            progressId: progress._id,
            lectureId,
        });
    }

    // initialize new lecture progress
    else {
        const lectureProgress = {
            lecture: lectureId,
            lastPosition: 0,
            watchedDuration: 0,
            isCompleted: false,
        };

        updatedProgress = await progressRepository.initializeLectureProgress({
            progressId: progress._id,
            lectureProgress,
            isCourseStarting: progress.status === PROGRESS_STATUS.NOT_STARTED,
        });
    }

    // find published course sections

    const sections = await sectionRepository.findSectionByCourse({
        courseId,
    });

    const sectionIds = sections.map(({ _id }) => _id);

    // find published course lectures

    const publishedLectures =
        await lectureRepository.findPublishedLecturesBySections({
            sectionIds,
        });

    // build calculated progress meta

    const meta = buildProgressCalculatedMeta({
        progress: updatedProgress,
        lectures: publishedLectures,
    });

    // return progress and calculated meta

    return {
        progress: updatedProgress,
        meta,
    };
};

///////////////////////////////////////////////////////////////
// update lecture progress service

const updateLectureProgress = async ({
    studentId,
    courseId,
    lectureId,
    progressData,
}) => {
    const progress = await progressRepository.findProgressByStudentAndCourse({
        studentId,
        courseId,
    });

    if (!progress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.PROGRESS_NOT_FOUND,
        });
    }

    // find published lecture

    const lecture = await lectureRepository.findPublishedLecture({
        lectureId,
    });

    if (
        !lecture ||
        lecture.section?.course?._id.toString() !== courseId.toString()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    // find lecture progress

    const lectureProgress = progress.lectures.find(
        ({ lecture }) => lecture.toString() === lectureId.toString()
    );

    if (!lectureProgress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.LECTURE_PROGRESS_NOT_FOUND,
        });
    }

    // update lecture progress

    const updatedProgress = await progressRepository.updateLectureProgress({
        progressId: progress._id,
        lectureId,
        progressData,
    });

    const sections = await sectionRepository.findSectionByCourse({
        courseId,
    });

    const sectionIds = sections.map(({ _id }) => _id);

    // find published course lectures

    const publishedLectures =
        await lectureRepository.findPublishedLecturesBySections({
            sectionIds,
        });

    // build calculated progress meta

    const meta = buildProgressCalculatedMeta({
        progress: updatedProgress,
        lectures: publishedLectures,
    });

    // return progress and calculated meta

    return {
        progress: updatedProgress,
        meta,
    };
};

////////////////////////////////////////////////////////////////
// update lecture completion progress

const updateLectureCompletionProgress = async ({
    studentId,
    courseId,
    lectureId,
}) => {
    // find student course progress

    const progress = await progressRepository.findProgressByStudentAndCourse({
        studentId,
        courseId,
    });

    if (!progress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.PROGRESS_NOT_FOUND,
        });
    }

    // find lecture progress

    const lectureProgress = progress.lectures.find(
        ({ lecture }) => lecture.toString() === lectureId.toString()
    );

    if (!lectureProgress) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: PROGRESS_ERROR_MESSAGES.LECTURE_PROGRESS_NOT_FOUND,
        });
    }

    // find published lecture

    const lecture = await lectureRepository.findPublishedLecture({
        lectureId,
    });

    if (
        !lecture ||
        lecture.section?.course?._id.toString() !== courseId.toString()
    ) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: LECTURE_ERROR_MESSAGES.NOT_FOUND,
        });
    }

    // check if lecture is already completed
    let updatedProgress = progress;

    if (!lectureProgress.isCompleted) {
        // check lecture completion threshold

        const canMarkAsCompleted = hasLectureReachedCompletionThreshold({
            watchedDuration: lectureProgress.watchedDuration,
            duration: lecture.video.duration,
        });

        if (!canMarkAsCompleted) {
            throw new ApiError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                message: PROGRESS_ERROR_MESSAGES.LECTURE_NOT_COMPLETED,
            });
        }

        // mark lecture as completed

        updatedProgress = await progressRepository.completeLectureProgress({
            progressId: progress._id,
            lectureId,
        });
    }

    // find published course sections

    const sections = await sectionRepository.findSectionByCourse({
        courseId,
    });

    const sectionIds = sections.map(({ _id }) => _id);

    // find published course lectures

    const publishedLectures =
        await lectureRepository.findPublishedLecturesBySections({
            sectionIds,
        });

    // count completed published lectures

    const completedLectureIds = new Set(
        updatedProgress.lectures
            .filter(({ isCompleted }) => isCompleted)
            .map(({ lecture }) => lecture.toString())
    );

    const completedLectures = publishedLectures.filter(({ _id }) =>
        completedLectureIds.has(_id.toString())
    );

    // check course completion

    const isCourseCompleted =
        publishedLectures.length > 0 &&
        completedLectures.length === publishedLectures.length;

    if (
        isCourseCompleted &&
        updatedProgress.status !== PROGRESS_STATUS.COMPLETED
    ) {
        updatedProgress = await progressRepository.completeCourseProgress({
            progressId: updatedProgress._id,
            completedAt: new Date(),
        });
    }

    // build calculated progress meta

    const meta = buildProgressCalculatedMeta({
        progress: updatedProgress,
        lectures: publishedLectures,
    });

    // return progress and calculated meta

    return {
        progress: updatedProgress,
        meta,
    };
};

//////////////////////////////////////////////////////////////
// exports

export {
    fetchCourseProgress,
    initializeLectureProgress,
    updateLectureProgress,
    updateLectureCompletionProgress,
};
