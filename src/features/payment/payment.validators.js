import { body } from "express-validator";

///////////////////////////////////////////////////////////////
// verify payment validators

const razorpayPaymentIdValidator = body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay payment ID is required.");

const razorpayOrderIdValidator = body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required.");

const razorpaySignatureValidator = body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage("Razorpay payment signature is required.");

const verifyPaymentValidator = [
    razorpayPaymentIdValidator,
    razorpayOrderIdValidator,
    razorpaySignatureValidator,
];

///////////////////////////////////////////////////////////////
// exports

export { verifyPaymentValidator };
