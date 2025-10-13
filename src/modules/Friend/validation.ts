import z from "zod";
import { createValidationSchema } from "../../middleware";

export const friendIDValidation = createValidationSchema({
  friendId: z.string(),
});

export const blockUserValidation = createValidationSchema({
  userId: z.string(),
});
