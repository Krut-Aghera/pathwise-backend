import mongoose from "mongoose";
import {
    ORDER_CURRENCY,
    ORDER_STATUS,
    ORDER_STATUS_ARRAY,
} from "./order.constants.js";

///////////////////////////////////////////////////////////////
// order schema model

const orderSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true,
            min: 0,
            immutable: true,
        },

        currency: {
            type: String,
            enum: [ORDER_CURRENCY],
            default: ORDER_CURRENCY,
            required: true,
            uppercase: true,
            trim: true,
            immutable: true,
        },

        status: {
            type: String,
            enum: ORDER_STATUS_ARRAY,
            default: ORDER_STATUS.PENDING,
        },

        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

///////////////////////////////////////////////////////////////
// compounud indexes

// student's orders / purchase history
orderSchema.index({
    student: 1,
    createdAt: -1,
});

// course orders / sales-related queries
orderSchema.index({
    course: 1,
    createdAt: -1,
});

// pending orders that may need expiry/cleanup
orderSchema.index({
    status: 1,
    expiresAt: 1,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
