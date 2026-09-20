module.exports = {
    apps: [
        {
            name: "pathwise-backend",
            script: "./dist/server.js",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
