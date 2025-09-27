import { Request, Response } from "express";
import { PostRepository, UserRepository } from "../../DB";
import { CreatePostDTO } from "./post.dto";
import { PostFactory } from "./factory";
import { ObjectId } from "mongoose";
import { IPost, IReaction, NotFoundException, REACTION_ENUM } from "../../utils";

class PostService {
  private readonly postFactory = new PostFactory();
  private readonly userRepository = new UserRepository();
  postRepository = new PostRepository();

  public create = async (req: Request, res: Response) => {
    const author = req.user._id as unknown as ObjectId;

    const createPostDTO: CreatePostDTO = req.body;

    const postData = this.postFactory.createPost(createPostDTO, author);

    const post = await this.postRepository.create(postData as unknown as IPost);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  };
  public createReaction = async (req: Request, res: Response) => {
    const userId = req.user._id as unknown as ObjectId;
    const { id } = req.params;

    const { reaction } = req.body;

    const postExists = await this.postRepository.isExists({ _id: id });
    const userExists = await this.userRepository.isExists({ _id: userId });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    if (!postExists) {
      throw new NotFoundException("Post not found");
    }

    const userReactedIndex = postExists.reactions.findIndex(
      (v) => v.userId?.toString() == userId?.toString()
    );

    let post = undefined;
    // add reaction
    if (userReactedIndex == -1) {
      post = await this.postRepository.updateOne(
        { _id: id },
        {
          $push: {
            reactions: {
              reaction: ["", null, undefined].includes(reaction) ? REACTION_ENUM.LIKE : reaction,
              userId,
            },
          },
        }
      );
    }
    // remove reaction
    else if ([undefined, null, ""].includes(reaction)) {
      post = await this.postRepository.updateOne(
        { _id: id, "reactions.userId": userId },
        {
          $pull: { reactions: postExists.reactions[userReactedIndex] },
        }
      );
    }
    // update reaction
    else {
      post = await this.postRepository.updateOne(
        { _id: id, "reactions.userId": userId },
        { "reactions.$.reaction": ["", null, undefined].includes(reaction) ? undefined : reaction }
      );
    }

    res.sendStatus(201);
  };
  public getPosts = async (req: Request, res: Response) => {
    const posts = await this.postRepository.findAll({});

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  };

  public getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await this.postRepository.findOne(
      { _id: id },
      {},
      {
        populate: [
          {
            path: "author",
            select: "_id fullName avatar firstName lastName",
          },
          {
            path: "reactions.userId",
            select: "_id fullName avatar firstName lastName",
          },
        ],
      }
    );

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  };
}

export default new PostService();
