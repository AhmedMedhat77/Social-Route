import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../utils";

export interface ICreateCommentDTO {
  content?: string;
  attachment?: IAttachment;
  reactions?: IReaction[];
  postId: ObjectId;
  userId: ObjectId;
  parentId?: ObjectId;
}
