import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "./Post";

export interface IComment {
  _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId;
  content: string;
  attachment: IAttachment;
  reactions: IReaction[];
  isDeleted: boolean;
}
