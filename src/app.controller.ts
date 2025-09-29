import express, { Express } from "express";
import config from "./config";
import cors from "cors";

import { connectDB } from "./DB";

// Routes
import { AuthRouter, CommentRouter, PostRouter } from "./modules";
// Utils
import { globalErrorHandler } from "./utils";

const bootstrap = async (app: Express) => {
  connectDB();
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Routes
  app.use("/auth", AuthRouter);
  app.use("/comment", CommentRouter);
  app.use("/post", PostRouter);

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
