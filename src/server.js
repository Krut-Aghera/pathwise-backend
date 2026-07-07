import "./config/env.config.js";
import app from "./app.js";
import { serverAppConfig } from "./config/env.config.js";
import logger from "./utils/pinoLogger.js";
import dbConnection from "./database/db.connection.js";

console.log("Welcome to Pathwise Backend!");

const startServer = async () => {
    await dbConnection.connect();

    app.listen(serverAppConfig.PORT, () => {
        logger.info(`Server running on port ${serverAppConfig.PORT}`);
        logger.info(`Environment: ${serverAppConfig.NODE_ENV}`);
    });
};

startServer();
