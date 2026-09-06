import mongoose from "mongoose";

import {
    RESOURCE_STATUS,
    RESOURCE_STATUS_ARRAY,
} from "../../constants/resource.constants.js";

///////////////////////////////////////////////////////////////
// section schema model

const sectionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
            immutable: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Section title is required"],
            trim: true,
            minlength: 3,
            maxlength: 120,
        },

        order: {
            type: Number,
            required: [true, "Section order is required"],
            min: 1,
        },

        status: {
            type: String,
            enum: {
                values: RESOURCE_STATUS_ARRAY,
                message: `Status must be one of: ${RESOURCE_STATUS_ARRAY.join(", ")}`,
            },
            default: RESOURCE_STATUS.DRAFT,
            index: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

///////////////////////////////////////////////////////////////
// compound indexes

// Fetch all sections of a course
// Used by:
// - instructor curriculum management
// - section reordering

sectionSchema.index({
    course: 1,
    isDeleted: 1,
    order: 1,
});

// Fetch published sections
// Used by:
// - course details aggregation
// - student curriculum view

sectionSchema.index({
    course: 1,
    status: 1,
    isDeleted: 1,
    order: 1,
});

// Prevent duplicate section titles inside the same course.
//
// Case-insensitive:
// "Introduction" and "introduction" are considered duplicates.
//
// Soft-deleted sections are ignored, allowing the title
// to be reused after deletion.

sectionSchema.index(
    {
        course: 1,
        title: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
        collation: {
            locale: "en",
            strength: 2,
        },
    }
);

///////////////////////////////////////////////////////////////
// model

const Section = mongoose.model("Section", sectionSchema);

export default Section;
