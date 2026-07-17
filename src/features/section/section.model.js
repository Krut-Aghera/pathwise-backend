import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
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

        order: {
            type: Number,
            required: [true, "Order is required"],
        },

        totalLectures: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

sectionSchema.index(
    {
        course: 1,
    },
    {
        unique: true,
    }
);

const Section = mongoose.model("Section", sectionSchema);

export default Section;
