import { env_paymentVars } from "../../config/env.config.js";
import {
    CASHFREE_API_BASE_URL,
    CASHFREE_API_VERSION,
} from "../../services/payment/payment-service.constants.js";

const cashfreeConfig = {
    clientId: env_paymentVars.CASHFREE_CLIENT_ID,
    clientSecret: env_paymentVars.CASHFREE_CLIENT_SECRET,
    apiVersion: CASHFREE_API_VERSION,
    baseUrl: CASHFREE_API_BASE_URL,
    timeout: 10000,
};

export default cashfreeConfig;
