import { Schema } from "mongoose";
import { IReaction, REACTION_ENUM } from "../../../utils";

export const reactionSchema = new Schema<IReaction>(
  {
    reaction: {
      type: String,
      enum: REACTION_ENUM,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

reactionSchema.pre("save", function (next) {
  if (this.reaction === undefined || this.reaction === null) {
    this.reaction = REACTION_ENUM.NONE;
  }
  next();
});
