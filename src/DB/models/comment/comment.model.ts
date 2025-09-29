import { model } from "mongoose";
import { commentSchema } from "./comment.schema";

export const commentModel = model("Comment", commentSchema);
