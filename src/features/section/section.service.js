///////////////////////////////////////////////////////////////
// create section service

const createSection = async ({ courseId, instructorId, title }) => {};

///////////////////////////////////////////////////////////////
// update section service

const updateSection = async ({ sectionId, instructorId, data }) => {};

///////////////////////////////////////////////////////////////
// remove section service

const removeSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// reorder sections service

const reorderSections = async ({ courseId, instructorId, sections }) => {};

///////////////////////////////////////////////////////////////
// publish section service

const publishSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// save section as draft service

const saveSectionAsDraft = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor section service

const fetchInstructorSection = async ({ sectionId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// fetch instructor sections service

const fetchInstructorSections = async ({ courseId, instructorId }) => {};

///////////////////////////////////////////////////////////////
// exports

export {
    createSection,
    updateSection,
    removeSection,
    reorderSections,
    publishSection,
    saveSectionAsDraft,
    fetchInstructorSection,
    fetchInstructorSections,
};
