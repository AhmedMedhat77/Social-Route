import { Schema } from "mongoose";
import { IAttachment, IPost } from "../../../utils";
import { reactionSchema } from "../common";

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
