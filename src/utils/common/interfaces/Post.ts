import { Document, ObjectId } from "mongoose";
import { REACTION_ENUM } from "../enum";

// Post Reactions
export interface IReaction {
  reaction: REACTION_ENUM;
  user: ObjectId;
}

export interface IAttachment {
  id: string;
  url: string;
}

export interface IPost extends Document {
  // Post Author
  author: ObjectId;

  // Post Content
  content: string;
  attachments: IAttachment[];
  // Post Reactions
  reactions: REACTION_ENUM[];
}
