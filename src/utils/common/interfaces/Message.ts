import { ObjectId } from "mongoose";

export interface IMessage {
  _id: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  content: string;
}
