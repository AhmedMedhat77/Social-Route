import { z } from "zod";
import { createValidationSchema } from "../../middleware";

export const updatePasswordSchema = createValidationSchema({
  oldPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
  
})