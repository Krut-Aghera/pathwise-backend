import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            immutable: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            immutable: true,
        },

        enrolledAt: {
            type: Date,
            default: Date.now,
            immutable: true,
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

///////////////////////////////////////////////////////////////
// compound indexes

// prevent duplicate active enrollments for the same student and course.
enrollmentSchema.index(
    {
        student: 1,
        course: 1,
    },
    {
        unique: true,
    }
);

// speed up fetching a student's enrolled courses.
enrollmentSchema.index({
    student: 1,
    isDeleted: 1,
});

// speed up fetching all students enrolled in a course.
enrollmentSchema.index({
    course: 1,
    isDeleted: 1,
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
