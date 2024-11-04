import logger from "../utils/error-logger.js";

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    const functionOrLine = err.stack.split("\n")[1]?.trim();
    logger.error({
        message: err.message,
        stack: functionOrLine,
    });

    // Send JSON response
    res.status(statusCode).json({ success: false, error: message });
};

export default errorMiddleware;
