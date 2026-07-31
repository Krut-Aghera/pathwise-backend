////////////////////////////////////////////////////////////////////////////////
// check if any reuired env is missing

const requireEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

////////////////////////////////////////////////////////////////////////////////
// export

export default requireEnv;
