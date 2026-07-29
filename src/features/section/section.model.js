import mongoose from "mongoose";
import {
    RESOURCE_STATUS,
    RESOURCE_STATUS_ARRAY,
} from "../../constants/resource.constants.js";

///////////////////////////////////////////////////////////////
// section schema

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
// indexes

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

// Prevent duplicate section order inside same course
//
// Example:
// Course A
// Section 1 -> order 1
// Another section -> order 1 ❌

sectionSchema.index(
    {
        course: 1,
        order: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

// Prevent duplicate section title inside same course
//
// Example:
// Course A
// Introduction
// Introduction ❌
//
// Course B
// Introduction ✅

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
    }
);

///////////////////////////////////////////////////////////////
// model

const Section = mongoose.model("Section", sectionSchema);

export default Section;
