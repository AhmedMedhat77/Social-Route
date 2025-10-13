import { Schema } from "mongoose";
import { IFriends } from "../../../utils/common/interfaces/Friends";
import { FRIENDS_STATUS_ENUM } from "../../../utils";

// friend.schema.ts
export const friendSchema = new Schema<IFriends>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for better query performance
    },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: FRIENDS_STATUS_ENUM,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
