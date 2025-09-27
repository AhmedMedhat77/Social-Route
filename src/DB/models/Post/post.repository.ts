import { AbstractRepository } from "../../abstract.repository";
import { IPost } from "../../../utils";
import { PostModel } from "./post.model";

export class PostRepository extends AbstractRepository<IPost> {
  constructor() {
    super(PostModel);
  }
}
