import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { attachmentSchema, reactionSchema } from "../common";
import { commentModel } from "../comment";

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
    
  }
);

/*
Virtuals are used to add virtual fields to the schema.
*/

/*
Virtual field for comments
*/

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

PostSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  // delete all comments
  const filter = typeof this.getFilter() === "function" ? this.getFilter() : this.getFilter();
  // get all comments
  await commentModel.deleteMany({ postId: filter._id });
  next();
});
