import { v2 as cloudinary } from "cloudinary";
import { env_cloudVars } from "../../config/env.config.js";
import logger from "../../utils/pino-logger.utility.js";

cloudinary.config({
    cloud_name: env_cloudVars.CLOUDINARY_CLOUD_NAME,
    api_key: env_cloudVars.CLOUDINARY_API_KEY,
    api_secret: env_cloudVars.CLOUDINARY_API_SECRET,
});

export default cloudinary;
