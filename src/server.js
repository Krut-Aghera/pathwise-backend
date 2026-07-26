import "./config/env.config.js";

import app from "./app.js";
import { serverAppConfig } from "./config/env.config.js";
import dbConnection from "./database/db.connection.js";
import ensureUploadDirectories from "./utils/tempdir-handler.utility.js";
import logger from "./utils/pino-logger.utility.js";

const startServer = async () => {
    try {
        await dbConnection.connect();
        await ensureUploadDirectories();

        app.listen(serverAppConfig.PORT, () => {
            logger.info(`🚀 Server running on port ${serverAppConfig.PORT}`);
            logger.info(`🌍 Environment: ${serverAppConfig.NODE_ENV}`);
        });
    } catch (error) {
        logger.fatal(error, "Failed to start server");
        process.exit(1);
    }
};

startServer();
