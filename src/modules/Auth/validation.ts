import { z } from "zod";
import { GENDER_ENUM } from "../../utils/common/enum";

export const registerSchema = z
  .object({
    fullName: z.string().min(3).max(100),
    email: z.email().optional(),
    password: z.string().min(6).max(100),
    gender: z.enum(GENDER_ENUM),
    avatar: z.string().optional(),
    dob: z.date().optional(),
    phone: z.string().optional(),
  })
  .refine(
    ({ email, phone }) => {
      return !!(email || phone);
    },
    {
      message: "Either email or phone is required",
    }
  );

export const RegisterWithGoogleSchema = z.object({
  googleId: z.string({ error: "Google ID is required" }),
});

export const verifyTwoFactorSchema = z.object({
  email: z.string({ error: "Email is required" }),
  twoFactorSecret: z.string({ error: "Two factor OTP is required" }),
});
