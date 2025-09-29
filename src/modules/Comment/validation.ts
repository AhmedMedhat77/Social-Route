import z from "zod";
import { createValidationSchema } from "../../middleware";
import { REACTION_ENUM } from "../../utils";

export const createCommentValidation = createValidationSchema({
  content: z.string().optional(),
  parentId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});
