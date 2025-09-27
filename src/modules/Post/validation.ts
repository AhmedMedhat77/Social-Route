import z from "zod";
import { createValidationSchema } from "../../middleware";
import { REACTION_ENUM } from "../../utils";

export const postValidation = createValidationSchema({
  content: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  reactions: z.array(z.enum(REACTION_ENUM)).optional(),
}).refine((data)=>{
  return !!(data.content || data.attachments?.length || 0 > 0);
}, {
  message: "Either content or attachments is required",
});

export const postReactionValidation = createValidationSchema({
  id: z.string(),
  reaction: z.enum(REACTION_ENUM),
});