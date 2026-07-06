import "./config/env.config.js";
import app from "./app.js";
import { serverConfig } from "./config/env.config.js";
import logger from "./utils/pinoLogger.js";

console.log("Welcome to Pathwise Backend!");

app.listen(serverConfig?.PORT || 5000, () => {
    logger.info(`App is running on ${serverConfig?.PORT || 5000} ✅`);
    logger.info(`App running in ${process.env.NODE_ENV} mode`);
});
