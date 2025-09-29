import { Router } from "express";
import commentService from "./comment.service";
import * as commentValidation from "./validation";
import { AuthMiddleware, isValid } from "../../middleware";

const router = Router({ mergeParams: true });

// Path => /:postId/comment/:commentId? => postId is required, commentId is optional

router.post(
  "/{:id}",
  isValid(commentValidation.createCommentValidation),
  commentService.createComment
);
router.get("/", commentService.getComments);
router.get("/:id", commentService.commentById);
router.delete("/:id", commentService.deleteComment);
router.patch("/:id/reaction", commentService.createReaction);
export default router;
