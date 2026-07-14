import crypto from "crypto";

const generateOtp = () => {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    return { otp, hashedOtp };
};

export default generateOtp;
