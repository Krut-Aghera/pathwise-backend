import fs from "fs/promises";

///////////////////////////////////////////////////////////////
// Safely delete a local file

const localFileCleanup = async (filePath) => {
    if (!filePath) {
        return;
    }

    try {
        await fs.unlink(filePath);
    } catch (error) {
        // Ignore if the file has already been deleted
        if (error.code === "ENOENT") {
            return;
        }

        throw error;
    }
};

///////////////////////////////////////////////////////////////
// Exports

export { localFileCleanup };
