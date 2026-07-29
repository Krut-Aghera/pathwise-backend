import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
    {
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: [true, "Section is required"],
            index: true,
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            lowercase: true,
            minlength: 5,
            maxlength: 120,
        },

        subtitle: {
            type: String,
            default: "",
            trim: true,
            maxlength: 180,
        },

        content: {
            type: String,
            default: "",
            trim: true,
            maxlength: 10000,
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

        duration: {
            type: Number,
            default: 0,
        },

        level: {
            type: String,
            trim: true,
            maxlength: 120,
        },

        description: {
            type: String,
            default: "",
            maxlength: 5000,
        },

        video: {
            url: {
                type: String,
                default: "",
            },

            publicId: {
                type: String,
                default: "",
            },

            duration: {
                type: Number,
                default: 0,
            },
        },

        resources: [
            {
                title: String,
                url: String,
                publicId: String,
            },
        ],

        isPreview: {
            type: Boolean,
            default: false,
        },

        order: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            // enum: Object.values(LECTURE_STATUS),
            // default: LECTURE_STATUS.DRAFT,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

lectureSchema.index(
    {
        section: 1,
        order: 1,
    },
    {
        unique: true,
    }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
