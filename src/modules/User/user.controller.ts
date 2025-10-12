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
router.patch("/update-email", isValid(validation.updateEmailSchema), UserService.updateEmail);
router.patch(
  "/two-factor-auth",
  isValid(validation.twoFactorAuthSchema),
  UserService.twoFactorAuth
);

router.post("/verify-otp", isValid(validation.verifyOTPSchema), UserService.verifyOTP);

router.put("/update-basic-info", UserService.updateBasicInfo);
export default router;
