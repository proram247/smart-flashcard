const mongoose = require("mongoose");
const { logInfo, logError } = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    logInfo("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    logError("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
