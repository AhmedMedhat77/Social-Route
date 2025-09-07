import express, { Express } from "express";
import config from "./config/config";
import cors from "cors";
import { connectDB } from "./DB/connect";
import { globalErrorHandler } from "./utils/error/GlobalError";
// Routes
import authRoutes from "./modules/Auth/auth.controller";

const bootstrap = async (app: Express) => {
  connectDB();
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Routes
  app.use("/auth", authRoutes);

  // Dummy Route for not found routes
  app.use("/{*dummy}", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Invalid URL",
    });
  });

  // Error Handler
  app.use(globalErrorHandler);

  // Server
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
export default bootstrap;
