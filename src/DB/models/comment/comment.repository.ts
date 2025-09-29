import { IComment } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { commentModel } from "./comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
  constructor() {
    super(commentModel);
  }
}
