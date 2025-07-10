require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const flashcardRoutes = require("./routes/flashcard");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const { logRequest, logInfo, logError } = require("./config/logger");
const rateLimit = require("express-rate-limit");

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple console logging for requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

// Request logging middleware (Winston file logging)
app.use(logRequest);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Smart Flashcard API Documentation",
  })
);

app.get("/health", (req, res, next) => {
  try {
    res.status(200).json({ message: "Server is healthy" });
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/v1/flashcard", flashcardRoutes);
//Error handling 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});
//Error handling middleware
app.use((err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  logError(`Error ${statusCode}: ${message}`, err);
  res.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API Documentation available at: http://localhost:${PORT}/api-docs`
  );
  logInfo(`Server started on port ${PORT}`);
});
