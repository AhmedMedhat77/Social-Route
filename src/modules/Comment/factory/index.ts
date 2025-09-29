import { ObjectId } from "mongoose";
import { ICreateCommentDTO } from "../comment.dto";
import { Comment } from "../entity";
import { IComment } from "../../../utils";

export class CommentFactoryService {
  createComment = (
    createCommentDTO: ICreateCommentDTO,
    userId: ObjectId,
    postId: ObjectId,
    comment?: IComment
  ) => {
    const newComment = new Comment();

    newComment.content = createCommentDTO.content;
    newComment.attachment = createCommentDTO.attachment;
    newComment.reactions = [];
    newComment.postId = postId;
    newComment.userId = userId;
    newComment.parentId = comment?._id;

    return newComment;
  };
}
