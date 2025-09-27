import { Router } from "express";
import postService from "./post.service";
import { AuthMiddleware, isValid } from "../../middleware";
import * as postValidation from "./validation";

const router = Router();

router.use(AuthMiddleware());

router.post("/", isValid(postValidation.postValidation), postService.create);

export default router;
