import winston from "winston";
import "winston-daily-rotate-file";

// Configure daily rotate file transport
const transport = new winston.transports.DailyRotateFile({
    filename: "logs/%DATE%-error.log",
    datePattern: "DD_MM_YYYY", // Creates a new file every minute
    level: "error",
    zippedArchive: true, // Compresses older files to save space
    maxSize: "20m",
});

// Configure logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.printf(({ timestamp, message, stack }) => {
            return `${timestamp} | ${message} | ${stack}`;
        })
    ),
    transports: [transport],
});

export default logger;
