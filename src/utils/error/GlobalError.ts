import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Handle JWT expiration
    if (err.message.includes("jwt expired")) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        stack: err.stack,
      });
    }

    // Handle AppError instances
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    }


    // Handle other errors
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      stack: error.stack,
    });
  }
};
