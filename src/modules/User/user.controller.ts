import { Router } from "express";
import UserService from "./user.service";
import { AuthMiddleware, isValid } from "../../middleware";
import * as validation from "./validation";

const router = Router();
router.use(AuthMiddleware());
router.get("/", UserService.getUser);

router.patch(
  "/update-password",
  isValid(validation.updatePasswordSchema),
  UserService.updatePassword
);


export default router;
