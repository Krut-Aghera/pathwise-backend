export const VIDEO_UPLOAD_STATUS = Object.freeze({
    PENDING: "PENDING",
    UPLOADING: "UPLOADING",
    PROCESSING: "PROCESSING",
    READY: "READY",
    FAILED: "FAILED",
});

export const VIDEO_UPLOAD_STATUS_LIST = Object.freeze(
    Object.values(VIDEO_UPLOAD_STATUS)
);
