import mongoose from "mongoose";
import { SECTION_STATUS } from "./section.constants.js";

///////////////////////////////////////////////////////////////
// section schema

const sectionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
            immutable: true,
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
            enum: Object.values(SECTION_STATUS),
            default: SECTION_STATUS.DRAFT,
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
// - instructor course curriculum management
// - reorder sections

sectionSchema.index({
    course: 1,
    isDeleted: 1,
    order: 1,
});

// Fetch published sections for students
// Used by:
// - course details aggregation

sectionSchema.index({
    course: 1,
    status: 1,
    isDeleted: 1,
    order: 1,
});

// Prevent duplicate section order
// Example:
// Course A cannot have two sections with order 1

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

///////////////////////////////////////////////////////////////
// model

const Section = mongoose.model("Section", sectionSchema);

export default Section;
