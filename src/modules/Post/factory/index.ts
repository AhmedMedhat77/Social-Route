import { ObjectId } from "mongoose";
import { Post } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactory {
  createPost = (createPostDTO: CreatePostDTO, author: ObjectId) => {
    const newPost = new Post();

    newPost.content = createPostDTO.content;
    newPost.attachments = createPostDTO.attachments || []; // Todo in next progress will be separate util
    newPost.reactions = [];
    newPost.author = author;

    return newPost;
  };
}
