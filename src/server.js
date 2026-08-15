import "./config/env.config.js";

import app from "./app.js";

import { env_appVars } from "./config/env.config.js";

import dbConnection from "./database/db.connection.js";

import ensureUploadDirectories from "./utils/tempdir-handler.utility.js";
import logger from "./utils/pino-logger.utility.js";

///////////////////////////////////////////////////////////////
// start server

const startServer = async () => {
    try {
        await dbConnection.connect();
        await ensureUploadDirectories();

        app.listen(env_appVars.PORT, () => {
            logger.info(`🚀 Server running on port ${env_appVars.PORT}`);
            logger.info(`🌍 Environment: ${env_appVars.NODE_ENV}`);
        });
    } catch (error) {
        logger.fatal(error, "Failed to start server");
        process.exit(1);
    }
};

startServer();
