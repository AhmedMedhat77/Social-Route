import { Schema } from "mongoose";
import { IAttachment, IPost, IReaction, REACTION_ENUM } from "../../../utils";

const attachmentSchema = new Schema<IAttachment>(
  {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
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

const reactionSchema = new Schema<IReaction>(
  {
    reaction: {
      type: String,
      enum: REACTION_ENUM,
      required: true,
    },
    user: {
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

export const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.attachments.length === 0;
      },
      trim: true,
    },
    attachments: [attachmentSchema],
    reactions: [reactionSchema],
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
