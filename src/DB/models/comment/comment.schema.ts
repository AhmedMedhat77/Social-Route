import { Schema } from "mongoose";
import { IComment } from "../../../utils";
import { attachmentSchema, reactionSchema } from "../common";

export const commentSchema = new Schema<IComment>(
  {
    attachment: attachmentSchema,
    reactions: [reactionSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

/*
Delete on it's default behavior for query 
it can be document but options added to make it clear how it works now even it's default behavior is query
but we are using query to make it clear how it works

*/
commentSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  // delete all replies
  const filter = typeof this.getFilter() === "function" ? this.getFilter() : this.getFilter();
  // get all replies
  const replies = await this.model.find({ parentId: filter._id });

  if (replies.length) {
    for (const reply of replies) {
      // recursively delete all replies and it's replies so we used delete one to recursively delete all replies and it's replies
      await this.model.deleteOne({ _id: reply._id });
    }
  }
  next();
});
