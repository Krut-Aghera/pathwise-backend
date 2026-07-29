///////////////////////////////////////////////////////////////
// create section repository

const createSection = async (sectionData) => {};

///////////////////////////////////////////////////////////////
// publish section repository

const publishSection = async ({ sectionId }) => {};

///////////////////////////////////////////////////////////////
// save section as draft repository

const saveSectionAsDraft = async ({ sectionId }) => {};

///////////////////////////////////////////////////////////////
// reorder sections repository

const reorderSections = async ({ courseId, sections }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor current section repository

const findInstructorSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor course sections repository

const findInstructorSections = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// exports

export {
    createSection,
    publishSection,
    saveSectionAsDraft,
    reorderSections,
    findInstructorSection,
    findInstructorSections,
};
