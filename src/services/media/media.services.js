import cloudinary from "./media.config.js";
import ApiError from "../../utils/error-handler.utility.js";
import logger from "../../utils/pino-logger.utility.js";

import HTTP_STATUS from "../../constants/http.constants.js";
import { validateUploadInput } from "./media.utility.js";
import { MEDIA_RESOURCE_TYPES } from "./media.constants.js";
import { localFileCleanup } from "../../utils/file-handler.utility.js";

///////////////////////////////////////////////////////////////
// Upload image
/**
 * @param {Object} params
 * @param {string} params.localFilePath - course thumbnail temp file address.
 * @param {string} params.folder - folder to save course thumbnail on cloud provider.
 */
const uploadImageMedia = async ({ localFilePath, folder }) => {
    validateUploadInput({
        localFilePath,
        folder,
        type: MEDIA_RESOURCE_TYPES.IMAGE,
    });

    try {
        const uploadedImage = await cloudinary.uploader.upload(localFilePath, {
            folder,
            resource_type: MEDIA_RESOURCE_TYPES.IMAGE,
            overwrite: true,
            invalidate: true,
        });

        logger.info(
            `Thumbnail uploaded successfully. Public ID: ${uploadedImage.public_id}`
        );

        return {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    } catch (error) {
        logger.error("Cloudinary upload failed", {
            folder,
            localFilePath,
            error: error.message,
        });

        throw new ApiError({
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "Image upload failed.",
            details: error.message,
        });
    } finally {
        if (!localFilePath) {
            return;
        }

        await localFileCleanup(localFilePath);
        logger.info("local image file got removed from temp dir");
    }
};

///////////////////////////////////////////////////////////////
// Upload video
/**
 * @param {Object} params
 * @param {string} params.localFilePath - Lecture video temporary file path.
 * @param {string} params.folder - Cloud provider folder where the lecture video will be stored.
 */
const uploadVideoMedia = async ({ localFilePath, folder }) => {
    validateUploadInput({
        localFilePath,
        folder,
        type: MEDIA_RESOURCE_TYPES.VIDEO,
    });

    try {
        const uploadedVideo = await cloudinary.uploader.upload(localFilePath, {
            folder,
            resource_type: MEDIA_RESOURCE_TYPES.VIDEO,
            overwrite: true,
            invalidate: true,

            // Better for large lecture videos
            chunk_size: 6000000,
        });

        return {
            url: uploadedVideo.secure_url,
            publicId: uploadedVideo.public_id,
            duration: uploadedVideo.duration ?? 0,
        };
    } catch (error) {
        logger.error("Cloudinary video upload failed.", {
            folder,
            localFilePath,
            error: error.message,
        });

        throw new ApiError({
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "Video upload failed.",
            details: error.message,
        });
    } finally {
        if (!localFilePath) {
            return;
        }

        await localFileCleanup(localFilePath);
        logger.info("Local video file removed from temp directory.");
    }
};

///////////////////////////////////////////////////////////////
// Generate video thumbnail URL
/**
 * @param {Object} params
 * @param {string} params.publicId - Cloud provider public ID.
 * @param {number} [params.startOffset=5] - Timestamp (in seconds) to capture the thumbnail.
 * @param {string} [params.format="jpg"] - Thumbnail image format.
 */
const generateVideoThumbnailUrl = ({
    publicId,
    startOffset = 5,
    format = "jpg",
}) => {
    if (!publicId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Media public ID is required.",
        });
    }

    const thumbnailUrl = cloudinary.url(publicId, {
        resource_type: MEDIA_RESOURCE_TYPES.VIDEO,
        format,
        secure: true,
        transformation: [
            {
                start_offset: startOffset,
            },
        ],
    });

    return thumbnailUrl;
};

///////////////////////////////////////////////////////////////
// Delete media
/**
 * @param {Object} params
 * @param {string} params.publicId - Cloud provider public ID.
 * @param {string} params.resourceType - Media resource type.
 */
const destroyMedia = async ({
    publicId,
    resourceType = MEDIA_RESOURCE_TYPES.IMAGE,
}) => {
    if (!publicId) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Media public ID is required.",
        });
    }

    if (!Object.values(MEDIA_RESOURCE_TYPES).includes(resourceType)) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Invalid media resource type.",
        });
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });

        if (result.result === "ok" || result.result === "not found") {
            return true;
        }

        logger.warn(
            `Unexpected Cloudinary destroy response for "${publicId}": ${result.result}`
        );

        return false;
    } catch (error) {
        throw new ApiError({
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "Media deletion failed.",
            details: error.message,
        });
    }
};

///////////////////////////////////////////////////////////////
// exports

export {
    uploadImageMedia,
    uploadVideoMedia,
    generateVideoThumbnailUrl,
    destroyMedia,
};
