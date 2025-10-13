import { ObjectId } from "mongoose";

export interface AddFriendDTO {
  friendId: ObjectId;
}

export interface BlockUserDTO {
  userId: ObjectId;
}
