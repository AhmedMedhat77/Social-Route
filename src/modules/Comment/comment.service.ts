import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import { ICreateCommentDTO } from "./comment.dto";
import { CommentFactoryService } from "./factory";
import { ForbiddenException, IComment, IPost, NotFoundException } from "../../utils";
import { ObjectId } from "mongoose";
import { AddReaction } from "../../utils/providers/AddReaction";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactory = new CommentFactoryService();
  public createComment = async (req: Request, res: Response) => {
    const { postId, id } = req.params;
    const userId = req.user._id;

    // check if post exists
    const post = await this.postRepository.isExists({ _id: postId });
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const commentDTO: ICreateCommentDTO = { ...req.body };

    let comment = undefined;

    if (id) {
      comment = await this.commentRepository.isExists({ _id: id });

      if (!comment) {
        throw new NotFoundException("Comment not found");
      }
    }

    // prepare data for comment
    const commentData = this.commentFactory.createComment(
      commentDTO,
      userId as ObjectId,
      post._id as ObjectId,
      comment
    );

    comment = await this.commentRepository.create(commentData);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  };
  public getComments = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { page = 1, limit = 2 } = req.query;

    const skip = (+page - 1) * +limit;

    const comments = await this.commentRepository.findAll({ postId }, {}, { skip, limit: +limit });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  };

  public commentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, size = 2 } = req.params;
    const skip = (+page - 1) * +size;
    const limit = +size;
    const comment = await this.commentRepository.findOne(
      { _id: id },
      {},
      {
        populate: [
          {
            path: "userId",
            select: "_id fullName avatar firstName lastName",
          },
          {
            path: "replies",
            populate: { path: "userId", select: "_id fullName avatar firstName lastName" },
          },
        ],
        skip,
        limit,
      }
    );

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      data: comment,
    });
  };

  public createReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;
    const { reaction } = req.body;

    await AddReaction(
      this.commentRepository,
      userId as ObjectId,
      id as unknown as ObjectId,
      reaction
    );
    res.sendStatus(201);
  };
  // delete comment and all it's replies
  public deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const commentExists = await this.commentRepository.findOne(
      {
        _id: id,
      },
      {},
      {
        populate: [
          { path: "postId", select: "_id author" },
          { path: "userId", select: "_id" },
        ],
      }
    );

    if (!commentExists) {
      throw new NotFoundException("Comment not found");
    }

    // Check if user is the comment author
    const isCommentAuthor = commentExists?.userId?.toString() === userId?.toString();

    // Check if user is the post owner
    const isPostOwner =
      (commentExists?.postId as unknown as IPost).author?.toString() === userId?.toString();

    // Allow deletion if user is either the comment author OR the post owner
    if (!isCommentAuthor && !isPostOwner) {
      throw new ForbiddenException("You are not authorized to delete this comment");
    }

    await this.commentRepository.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  };
}

export default new CommentService();
