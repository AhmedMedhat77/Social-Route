import { ObjectId } from "mongoose";
import { FRIENDS_STATUS_ENUM } from "../enum";

export interface IFriends {
  userId: ObjectId;
  friendId: ObjectId;
  isBlocked: boolean;
  status: FRIENDS_STATUS_ENUM;
  blockedAt: Date;
  
}
