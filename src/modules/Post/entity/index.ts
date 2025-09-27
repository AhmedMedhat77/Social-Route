import { ObjectId } from "mongoose";
import { IReaction } from "../../../utils";

export class Post {
  public content?: string;
  public attachments?: any[];
  public reactions?: IReaction[];
  public author!: ObjectId;
}
