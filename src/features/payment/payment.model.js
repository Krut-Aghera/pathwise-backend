import mongoose from "mongoose";

import {
    PAYMENT_STATUS,
    PAYMENT_PROVIDER,
    PAYMENT_METHOD,
} from "./payment.constants.js";
import { ORDER_CURRENCY } from "../order/order.constants.js";

///////////////////////////////////////////////////////////////
// payment schema model

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            immutable: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
            required: true,
            enum: [ORDER_CURRENCY],
            default: ORDER_CURRENCY,
            immutable: true,
        },

        method: {
            type: String,
            enum: Object.values(PAYMENT_METHOD),
            default: null,
        },

        provider: {
            type: String,
            required: true,
            enum: Object.values(PAYMENT_PROVIDER),
            immutable: true,
        },

        providerOrderId: {
            type: String,
            required: true,
            trim: true,
            immutable: true,
        },

        providerPaymentId: {
            type: String,
            default: null,
            trim: true,
            immutable: true,
        },

        status: {
            type: String,
            required: true,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

///////////////////////////////////////////////////////////////
// compound indexes

// find payments belonging to a specific order
paymentSchema.index({
    order: 1,
});

// find payments belonging to a specific student
paymentSchema.index({
    student: 1,
});

// provider order ID must be unique per provider
paymentSchema.index(
    {
        provider: 1,
        providerOrderId: 1,
    },
    {
        unique: true,
    }
);

// provider payment ID must be unique per provider
// sparse allows multiple documents where providerPaymentId is null
paymentSchema.index(
    {
        provider: 1,
        providerPaymentId: 1,
    },
    {
        unique: true,
        sparse: true,
    }
);

///////////////////////////////////////////////////////////////
// model

const Payment = mongoose.model("Payment", paymentSchema);

///////////////////////////////////////////////////////////////
// export

export default Payment;
