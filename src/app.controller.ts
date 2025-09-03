import express, { Express } from "express";
import config from "./config/config";
import cors from "cors";
import { connectDB } from "./DB/connect";
import { globalErrorHandler } from "./utils/error/GlobalError";

const bootstrap = async (app: Express) => {
  connectDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(globalErrorHandler);
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
export default bootstrap;
