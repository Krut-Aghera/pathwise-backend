import mongoose from "mongoose";

import logger from "../utils/pinoLogger.js";
import { dbConfig } from "../config/env.config.js";

class DatabaseConnection {
    constructor() {
        // Register application-wide listeners once during startup.
        this.registerConnectionEvents();
        this.registerShutdownHooks();
    }

    // Returns true when Mongoose has an active connection.
    get isConnected() {
        return mongoose.connection.readyState === 1;
    }

    async connect() {
        if (this.isConnected) {
            logger.info("MongoDB is already connected.");
            return mongoose.connection;
        }

        if (!dbConfig.MONGO_URI) {
            logger.fatal("MONGO_URI is missing.");
            process.exit(1);
        }

        try {
            const connection = await mongoose.connect(
                `${dbConfig.MONGO_URI}/${dbConfig?.DB_NAME}`,
                {
                    // Connection pool configuration.
                    maxPoolSize: 10,
                    minPoolSize: 2,

                    // Fail fast if MongoDB is unreachable.
                    serverSelectionTimeoutMS: 10000,

                    // Close inactive sockets after 45 seconds.
                    socketTimeoutMS: 45000,
                }
            );

            logger.info(
                {
                    host: connection.connection.host,
                    port: connection.connection.port,
                    database: connection.connection.name,
                },
                "MongoDB connected successfully."
            );

            return connection;
        } catch (error) {
            logger.fatal(
                {
                    err: error,
                },
                "Failed to connect to MongoDB."
            );

            // Stop the application if the database is unavailable.
            process.exit(1);
        }
    }

    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        await mongoose.connection.close();

        logger.info("MongoDB connection closed.");
    }

    registerConnectionEvents() {
        mongoose.connection.on("connected", () => {
            logger.info("MongoDB connection established.");
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected.");
        });

        mongoose.connection.on("reconnected", () => {
            logger.info("MongoDB reconnected.");
        });

        mongoose.connection.on("error", (error) => {
            logger.error(
                {
                    err: error,
                },
                "MongoDB connection error."
            );
        });
    }

    registerShutdownHooks() {
        const gracefulShutdown = async (signal) => {
            logger.info(
                {
                    signal,
                },
                "Gracefully shutting down MongoDB connection."
            );

            try {
                await this.disconnect();
            } finally {
                process.exit(0);
            }
        };

        // Handle common termination signals (Ctrl+C, Docker, PM2, etc.).
        process.once("SIGINT", () => gracefulShutdown("SIGINT"));
        process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
    }

    getConnectionStatus() {
        const states = {
            0: "DISCONNECTED",
            1: "CONNECTED",
            2: "CONNECTING",
            3: "DISCONNECTING",
        };

        return {
            connected: this.isConnected,
            state: states[mongoose.connection.readyState],
        };
    }

    // Used by health-check endpoints or monitoring systems.
    async healthCheck() {
        try {
            await mongoose.connection.db.admin().ping();

            return {
                status: "healthy",
                database: mongoose.connection.name,
            };
        } catch (error) {
            logger.error(
                {
                    err: error,
                },
                "MongoDB health check failed."
            );

            return {
                status: "unhealthy",
            };
        }
    }
}

export default new DatabaseConnection();
