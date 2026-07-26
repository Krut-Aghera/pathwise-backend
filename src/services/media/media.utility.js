export const validateUploadInput = ({ localFilePath, folder, type }) => {
    if (!localFilePath) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: `Local ${type} file path is required.`,
        });
    }

    if (!folder) {
        throw new ApiError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: "Cloudinary folder is required.",
        });
    }
};
