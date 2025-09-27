import { model } from "mongoose";
import { PostSchema } from "./post.schema";

export const PostModel = model("Post", PostSchema);
