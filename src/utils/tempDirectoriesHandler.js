import fs from "fs/promises";

import {
    TEMP_IMAGE_UPLOAD_DIR,
    TEMP_VIDEO_UPLOAD_DIR,
} from "../middlewares/multer/multer.constants.js";

const ensureUploadDirectories = async () => {
    await Promise.all([
        fs.mkdir(TEMP_IMAGE_UPLOAD_DIR, {
            recursive: true,
        }),

        fs.mkdir(TEMP_VIDEO_UPLOAD_DIR, {
            recursive: true,
        }),
    ]);
};

export default ensureUploadDirectories;
