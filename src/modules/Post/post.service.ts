import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import { CreatePostDTO } from "./post.dto";
import { PostFactory } from "./factory";
import { ObjectId } from "mongoose";
import { IPost } from "../../utils";

class PostService {
  private readonly postFactory = new PostFactory();
  postRepository = new PostRepository();

  create = async (req: Request, res: Response) => {
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
}

export default new PostService();
