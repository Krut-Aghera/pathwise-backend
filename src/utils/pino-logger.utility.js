import pino from "pino";
import { env_appVars } from "../config/env.config.js";

const isDevelopment = env_appVars?.NODE_ENV === "development";

const logger = pino({
    level: isDevelopment ? "debug" : "info",

    transport: isDevelopment
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
              },
          }
        : undefined,
});

export default logger;
