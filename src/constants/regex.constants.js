const REGEX_VALIDATIONS = {
    username: {
        PATTERN: /^[a-zA-Z]+(?: +[a-zA-Z]+)*$/,
        MESSAGE:
            "Username can only contain letters and spaces. Numbers and special characters are not allowed.",
        HINT: "Use letters (A-Z, a-z) and spaces between words. A single word is also allowed. Maximum 30 characters.",
    },

    email: {
        PATTERN: /^\S+@\S+\.\S+$/,
        MESSAGE: "Please provide a valid email address.",
        HINT: "Email must contain '@' and a domain (e.g. user@example.com).",
    },

    password: {
        PATTERN: /^.{8,}$/,
        MESSAGE: "Password must be at least 8 characters long.",
        HINT: "Use at least 8 characters. A mix of uppercase, lowercase, numbers, and symbols is recommended.",
    },
};

export default REGEX_VALIDATIONS;
