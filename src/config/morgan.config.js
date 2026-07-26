import morgan from "morgan";
import logger from "../utils/pino-logger.utility.js";

const stream = {
    write: (message) => logger.info(message.trim()),
};

const morganLogger = morgan(":method :url :status :response-time ms", {
    stream,
});

export default morganLogger;
