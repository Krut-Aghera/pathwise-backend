const REGEX_VALIDATIONS = {
    username: {
        PATTERN: /^(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/,
        MESSAGE:
            "Username can only contain letters, numbers, and underscores. Spaces and other special characters are not allowed.",
        HINT: "Use letters (A-Z, a-z), numbers (0-9), and underscores (_). No spaces or special characters. Maximum 30 characters.",
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
