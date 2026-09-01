///////////////////////////////////////////////////////////////
// escape regex special characters

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default escapeRegex;
