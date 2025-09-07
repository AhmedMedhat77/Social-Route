import dotenv from "dotenv";
import { StringValue } from "ms";
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  DB_URL: string;
  emailUser: string;
  TOKEN_SECRET: string;
  RESET_TOKEN_SECRET: string;
  EMAIL_PASSWORD: string;
  EMAIL_USER: string;
  GOOGLE_AUTH_CLIENT: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  NODE_ENV: string;
  ACCESS_TOKEN_TIME: StringValue;
  REFRESH_TOKEN_TIME: StringValue;
  RESET_TOKEN_TIME: StringValue;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "",
  emailUser: process.env.EMAIL_USER || "",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",
  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_USER: process.env.EMAIL_USER || "",
  GOOGLE_AUTH_CLIENT: process.env.GOOGLE_AUTH_CLIENT || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "development",

  ACCESS_TOKEN_TIME: "15m",
  RESET_TOKEN_TIME: "5m",
  REFRESH_TOKEN_TIME: "7d",
};

export default config;
