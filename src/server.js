import "./config/env.config.js";
import app from "./app.js";
import { serverAppConfig } from "./config/env.config.js";
import logger from "./utils/pinoLogger.js";

console.log("Welcome to Pathwise Backend!");

app.listen(serverAppConfig?.PORT || 5000, () => {
    logger.info(`App is running on ${serverAppConfig?.PORT || 5000} `);
    logger.info(`App running in ${serverAppConfig?.NODE_ENV} mode`);
});
