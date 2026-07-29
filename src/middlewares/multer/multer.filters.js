import HTTP_STATUS from "../../constants/http.constants.js";
import ApiError from "../../utils/error-handler.utility.js";

import {
    ALLOWED_IMAGE_MIME_TYPES,
    ALLOWED_VIDEO_MIME_TYPES,
} from "./multer.constants.js";

///////////////////////////////////////////////////////////////
// Generic MIME type filter

const createMimeTypeFilter = (allowedMimeTypes, message) => {
    return (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new ApiError({
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    message,
                })
            );
        }

        cb(null, true);
    };
};

///////////////////////////////////////////////////////////////
// Image filter

const imageFileFilter = createMimeTypeFilter(
    ALLOWED_IMAGE_MIME_TYPES,
    "Only JPG, JPEG, PNG and WEBP image files are allowed."
);

///////////////////////////////////////////////////////////////
// Video filter

const videoFileFilter = createMimeTypeFilter(
    ALLOWED_VIDEO_MIME_TYPES,
    "Only MP4, MOV and WEBM video files are allowed."
);

///////////////////////////////////////////////////////////////
// Exports

export { imageFileFilter, videoFileFilter };
