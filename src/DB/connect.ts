import mongoose from "mongoose";
import config from "../config";
import AppError, { ErrorCodes } from "../utils/error/AppError";

export const connectDB = async () => {
  if (!config.DB_URL) {
    throw new AppError("DB_URL is not defined", ErrorCodes.FORBIDDEN);
  }
  try {
    await mongoose.connect(config.DB_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB successfully ✅");
  } catch (error) {
    console.log("Connected to MongoDB failed ❌");
  }
};
