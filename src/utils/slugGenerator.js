import slugify from "slugify";

const generateSlug = (value) => {
    return slugify(value, {
        trim: true,
        lower: true,
        strict: true,
    });
};

export default generateSlug;
