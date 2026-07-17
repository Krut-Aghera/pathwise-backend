import { v2 as cloudinary } from "cloudinary";

import ApiError from "../../utils/errorHandler.js";
import HTTP_STATUS from "../../constants/http-status.js";
import { validateMediaUploadInput } from "./media.helper.js";

///////////////////////////////////////////////////////////////
// Upload image

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

        return {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    } catch (error) {
        throw new ApiError({
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "Image upload failed.",
            details: error.message,
        });
    }
};

///////////////////////////////////////////////////////////////
// Upload video

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
        throw new ApiError({
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "Video upload failed.",
            details: error.message,
        });
    }
};

///////////////////////////////////////////////////////////////
// Delete media

const deleteMedia = async ({
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

        return result.result === "ok";
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

export { uploadImageMedia, uploadVideoMedia, deleteMedia };
