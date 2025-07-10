const winston = require("winston");
const path = require("path");

// Create logs directory if it doesn't exist
const fs = require("fs");
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log formats
const requestLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({
      timestamp,
      level,
      message,
      ip,
      method,
      url,
      statusCode,
      responseTime,
    }) => {
      return `${timestamp} [${level.toUpperCase()}] ${ip} ${method} ${url} ${statusCode} ${responseTime}ms`;
    }
  )
);

const appLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Request logs - stores IP, method, URL, status code, response time
    new winston.transports.File({
      filename: path.join(logsDir, "requests.log"),
      format: requestLogFormat,
      level: "info",
    }),

    // Application logs - stores general application events, errors, etc.
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
      format: appLogFormat,
      level: "info",
    }),
  ],
});

// Request logging middleware
const logRequest = (req, res, next) => {
  const start = Date.now();

  // Capture response details
  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";

    logger.info("HTTP Request", {
      ip: ip,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: duration,
      userAgent: req.get("User-Agent"),
    });
  });

  next();
};

// Application logging functions
const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logError = (message, error = null) => {
  if (error) {
    logger.error(message, { error: error.message, stack: error.stack });
  } else {
    logger.error(message);
  }
};

const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

module.exports = {
  logger,
  logRequest,
  logInfo,
  logError,
  logWarn,
  logDebug,
};
