import { env_paymentVars } from "../../config/env.config.js";
import { RAZORPAY_API_BASE_URL } from "./payment-service.constants.js";

const razorpayConfig = {
    keyId: env_paymentVars.RAZORPAY_API_KEY,
    keySecret: env_paymentVars.RAZORPAY_API_SECRET,
    webhookSecret: env_paymentVars.RAZORPAY_WEBHOOK_SECRET,
    baseUrl: RAZORPAY_API_BASE_URL,
    timeout: 10000,
};

export default razorpayConfig;
