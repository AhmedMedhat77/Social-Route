import { ObjectId } from "mongoose";
import { IReaction } from "../../utils";

export interface CreatePostDTO {
  content?: string;
  attachments?: any[];
  reactions?: IReaction[];
  author: ObjectId;
}
