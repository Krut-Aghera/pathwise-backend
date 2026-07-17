import multer from "multer";

import { imageStorage, videoStorage } from "./multer.config.js";
import { imageFileFilter, videoFileFilter } from "./multer.filters.js";
import {
    IMAGE_MAX_FILE_SIZE,
    VIDEO_MAX_FILE_SIZE,
} from "./multer.constants.js";

///////////////////////////////////////////////////////////////
// local utility to create multer uploader

const createUploader = ({ storage, fileFilter, maxFileSize }) => {
    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxFileSize,
            files: 1,
        },
    });
};

///////////////////////////////////////////////////////////////
// multer uploader for image

const imageUpload = createUploader({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    maxFileSize: IMAGE_MAX_FILE_SIZE,
});

///////////////////////////////////////////////////////////////
// multer uploader for video

const videoUpload = createUploader({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    maxFileSize: VIDEO_MAX_FILE_SIZE,
});

///////////////////////////////////////////////////////////////
// exports

export { imageUpload, videoUpload };
