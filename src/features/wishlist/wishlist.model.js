import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            immutable: true,
        },

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    {
        timestamps: true,
    }
);

///////////////////////////////////////////////////////////////
// unique student wishlist

wishlistSchema.index(
    {
        student: 1,
    },
    {
        unique: true,
    }
);

///////////////////////////////////////////////////////////////
// model

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

///////////////////////////////////////////////////////////////
// export

export default Wishlist;
