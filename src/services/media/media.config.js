import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../../config/env.config.js";

cloudinary.config({
    cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
    api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET,
});

export default cloudinary;
