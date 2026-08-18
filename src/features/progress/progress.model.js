import mongoose from "mongoose";

import { PROGRESS_STATUS } from "./progress.constants.js";

///////////////////////////////////////////////////////////////
// lecture progress schema

const lectureProgressSchema = new mongoose.Schema(
    {
        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            required: true,
        },

        lastPosition: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        watchedDuration: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        isCompleted: {
            type: Boolean,
            required: true,
            default: false,
        },

        lastAccessedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        _id: false,
    }
);

////////////////////////////////////////////////////////////////
// progress schema

const progressSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        lectures: {
            type: [lectureProgressSchema],
            default: [],
        },

        lastAccessedLecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            default: null,
        },

        lastCompletedLecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            default: null,
        },

        status: {
            type: String,
            enum: Object.values(PROGRESS_STATUS),
            default: PROGRESS_STATUS.NOT_STARTED,
            required: true,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

////////////////////////////////////////////////////////////////
// compound index

progressSchema.index(
    {
        student: 1,
        course: 1
    },
    {
        unique: true
    }
);

////////////////////////////////////////////////////////////////
// model

const Progress = mongoose.model("Progress", progressSchema);

//////////////////////////////////////////////////////////////
// export

export default Progress;