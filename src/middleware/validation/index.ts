import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../../utils/error/AppError";
import z from "zod";

// Validation middleware using Zod
export const isValid = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validate = { ...req.query, ...req.body, ...req.params };

      const result = schema.parse(validate);

      // Attach validated data to request for use in controllers
      if (typeof result === "object" && result !== null) {
        req.body = { ...req.body, ...result };
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.issues.map((err: z.core.$ZodIssue) => {
          return {
            field: err.path[0] as string,
            message: err.message,
          };
        });

        return next(new BadRequestException("Validation failed", errorDetails));
      }
      return next(new BadRequestException("Validation failed"));
    }
  };
};

// Helper function to create validation schemas
export const createValidationSchema = <T extends z.ZodRawShape>(schema: T) => {
  return z.object(schema);
};
