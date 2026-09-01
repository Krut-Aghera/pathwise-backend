import mongoose from "mongoose";

import {
    RESOURCE_STATUS,
    RESOURCE_STATUS_ARRAY,
} from "../../constants/resource.constants.js";

import {
    COURSE_LANGUAGES,
    COURSE_LANGUAGES_ARRAY,
    COURSE_LEVELS,
    COURSE_LEVELS_ARRAY,
} from "./course.constants.js";

////////////////////////////////////////////////////////////////
// course schema model

const courseSchema = new mongoose.Schema(
    {
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Instructor is required"],
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [120, "Title cannot exceed 120 characters"],
        },

        subtitle: {
            type: String,
            trim: true,
            required: [true, "Subtitle is required."],
            maxlength: [180, "Subtitle cannot exceed 180 characters"],
            default: "",
        },

        slug: {
            type: String,
            required: [true, "Slug is required"],
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [10000, "Description cannot exceed 10000 characters"],
        },

        thumbnail: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be greater than or equal to 0"],
        },

        language: {
            type: String,
            enum: {
                values: COURSE_LANGUAGES_ARRAY,
                message: `Language must be one of: ${COURSE_LANGUAGES_ARRAY.join(", ")}`,
            },
            default: COURSE_LANGUAGES.ENGLISH,
        },

        level: {
            type: String,
            enum: {
                values: COURSE_LEVELS_ARRAY,
                message: `Level must be one of: ${COURSE_LEVELS_ARRAY.join(", ")}`,
            },
            default: COURSE_LEVELS.BEGINNER,
        },

        learningOutcomes: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            default: [],
            validate: {
                validator: (arr) => arr.length <= 20,
                message: "Maximum 20 learning outcomes are allowed.",
            },
        },

        requirements: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            default: [],
            validate: {
                validator: (arr) => arr.length <= 20,
                message: "Maximum 20 requirements are allowed.",
            },
        },

        targetAudience: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            default: [],
            validate: {
                validator: (arr) => arr.length <= 20,
                message: "Maximum 20 target audience items are allowed.",
            },
        },

        status: {
            type: String,
            enum: {
                values: RESOURCE_STATUS_ARRAY,
                message: `Status must be one of: ${RESOURCE_STATUS_ARRAY.join(", ")}`,
            },
            default: RESOURCE_STATUS.DRAFT,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

///////////////////////////////////////////////////////////////
// compound indexes

// unique slug for active courses only

courseSchema.index(
    { slug: 1 },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

// Instructor course listing
courseSchema.index({
    instructor: 1,
    isDeleted: 1,
    createdAt: -1,
});

// Public course listing
courseSchema.index({
    status: 1,
    isDeleted: 1,
    createdAt: -1,
});

// Text search
courseSchema.index(
    {
        title: "text",
        slug: "text",
        subtitle: "text",
        description: "text",
    },
    {
        language_override: "textSearchLanguage",
    }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
