import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class Comment {
  public attachment?: IAttachment;
  public reactions?: IReaction[];
  public isDeleted!: boolean;
  public postId!: ObjectId;
  public userId!: ObjectId;
  public parentId?: ObjectId;
  public content?: string;
}
