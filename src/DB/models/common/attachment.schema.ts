import { Schema } from "mongoose";
import { IAttachment } from "../../../utils";

export const attachmentSchema = new Schema<IAttachment>(
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
