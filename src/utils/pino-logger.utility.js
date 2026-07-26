import pino from "pino";
import { serverAppConfig } from "../config/env.config.js";

const isDevelopment = serverAppConfig?.NODE_ENV === "development";

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
