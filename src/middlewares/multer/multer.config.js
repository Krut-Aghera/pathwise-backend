import crypto from "crypto";
import path from "path";
import multer from "multer";

import {
    TEMP_IMAGE_UPLOAD_DIR,
    TEMP_VIDEO_UPLOAD_DIR,
} from "./multer.constants.js";

///////////////////////////////////////////////////////////////
// local utility for filename generation

const generateFilename = (prefix, originalname) => {
    const extension = path.extname(originalname).toLowerCase();

    return `${prefix}-${Date.now()}-${crypto.randomUUID()}${extension}`;
};

///////////////////////////////////////////////////////////////
// image storage

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_IMAGE_UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        cb(null, generateFilename("pathwise-image", file.originalname));
    },
});

///////////////////////////////////////////////////////////////
// video storage

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_VIDEO_UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        cb(null, generateFilename("pathwise-video", file.originalname));
    },
});

///////////////////////////////////////////////////////////////
// exports

export { imageStorage, videoStorage };
