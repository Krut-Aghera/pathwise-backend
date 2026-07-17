import path from "path";

export const TEMP_IMAGE_UPLOAD_DIR = path.resolve("temp/images");
export const TEMP_VIDEO_UPLOAD_DIR = path.resolve("temp/videos");

export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const ALLOWED_VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

export const IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const VIDEO_MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
