import { beforeAll, afterAll } from "vitest";

import dbConnection from "../../src/database/db.connection.js";
import logger from "../../src/utils/pino-logger.utility.js";

beforeAll(async () => {
    await dbConnection.connect();
    logger.info("DB connection is opened for API TESTING 📊")
});

afterAll(async () => {
    await dbConnection.disconnect();
    logger.info("DB connection is closed for API TESTING 📊")
});