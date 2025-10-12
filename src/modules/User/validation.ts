import { z } from "zod";
import { createValidationSchema } from "../../middleware";

export const updatePasswordSchema = createValidationSchema({
  oldPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
});

export const updateEmailSchema = createValidationSchema({
  email: z.email({ error: "Invalid email" }),
});

export const twoFactorAuthSchema = createValidationSchema({
  enable: z.enum(["true", "false"]),
});

export const verifyOTPSchema = createValidationSchema({
  email: z.email({ error: "Invalid email" }),
  otp: z.string().length(5),
});
