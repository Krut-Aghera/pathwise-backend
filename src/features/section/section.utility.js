import * as sectionRepository from "./section.repository.js";

///////////////////////////////////////////////////////////////
// validate instructor section ownership

const validateInstructorSectionOwnership = async ({
    sectionId,
    instructorId,
}) => {
    const section = await sectionRepository.findInstructorSection({
        sectionId,
        instructorId,
    });

    if (!section || !section.course) {
        throw new ApiError({
            statusCode: HTTP_STATUS.NOT_FOUND,
            message: "Section not found.",
        });
    }

    return section;
};

///////////////////////////////////////////////////////////////
// exports

export { validateInstructorSectionOwnership };
