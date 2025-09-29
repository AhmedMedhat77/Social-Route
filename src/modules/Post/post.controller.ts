import { Router } from "express";
import postService from "./post.service";
import { AuthMiddleware, isValid } from "../../middleware";
import * as postValidation from "./validation";
import { CommentRouter } from "..";

// Must import CommentRouter here to avoid circular dependency

const router = Router();

router.use(AuthMiddleware());

router.use("/:postId/comment", CommentRouter);

router.use(AuthMiddleware());

router.get("/", postService.getPosts);

router.post("/", isValid(postValidation.postValidation), postService.create);

router.get("/:id", isValid(postValidation.postIdValidation), postService.getPostById);

router.patch(
  "/:id/reaction",
  isValid(postValidation.postReactionValidation),
  postService.createReaction
);

router.delete("/:id", postService.deletePost);

export default router;
