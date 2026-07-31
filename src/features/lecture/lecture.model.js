import mongoose from "mongoose";
import {
    RESOURCE_STATUS,
    RESOURCE_STATUS_ARRAY,
} from "../../constants/resource.constants.js";

/////////////////////////////////////////////////////////////////
// video schema

const videoSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            trim: true,
        },

        secureUrl: {
            type: String,
            required: true,
            trim: true,
        },

        thumbnailUrl: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: Number,
            required: true,
            min: 0,
        },

        fileSize: {
            type: Number,
            required: true,
            min: 0,
        },

        format: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        width: {
            type: Number,
            required: true,
            min: 1,
        },

        height: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

/////////////////////////////////////////////////////////////////
// lecture schema

const lectureSchema = new mongoose.Schema(
    {
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 3000,
        },

        video: {
            type: videoSchema,
            default: null,
        },

        isPreviewFree: {
            type: Boolean,
            default: false,
        },

        order: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: Object.values(RESOURCE_STATUS_ARRAY),
            default: RESOURCE_STATUS.DRAFT,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

/////////////////////////////////////////////////////////////////
// compound indexes

// fetch section lectures ordered by order
lectureSchema.index({
    section: 1,
    isDeleted: 1,
    order: 1,
});

// prevent duplicate lecture order within a section
lectureSchema.index(
    {
        section: 1,
        order: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

// prevent duplicate lecture titles within a section
lectureSchema.index(
    {
        section: 1,
        title: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
        collation: {
            locale: "en",
            strength: 2, // Case-insensitive
        },
    }
);

// filter draft/published lectures within a section
lectureSchema.index({
    section: 1,
    status: 1,
    isDeleted: 1,
});

/////////////////////////////////////////////////////////////////

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
