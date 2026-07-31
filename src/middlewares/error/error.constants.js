///////////////////////////////////////////////////////////////
// duplicate key error messages

const DUPLICATE_KEY_MESSAGES = Object.freeze({
    email: "Email already exists.",
    username: "Username already exists.",
    slug: "Slug already exists.",

    "course,title": "A section with this title already exists in this course.",

    "section,title":
        "A lecture with this title already exists in this section.",
});

///////////////////////////////////////////////////////////////
// exports

export { DUPLICATE_KEY_MESSAGES };
