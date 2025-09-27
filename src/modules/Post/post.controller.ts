import { Router } from "express";
import postService from "./post.service";
import { AuthMiddleware, isValid } from "../../middleware";
import * as postValidation from "./validation";

const router = Router();

router.use(AuthMiddleware());

router.get("/", postService.getPosts);

router.post("/", isValid(postValidation.postValidation), postService.create);

router.patch("/:id/reaction", isValid(postValidation.postReactionValidation), postService.createReaction);

export default router;
