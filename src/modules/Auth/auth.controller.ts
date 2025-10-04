import { Router } from "express";
import AuthService from "./auth.service";
import * as validation from "./validation";
import { isValid } from "../../middleware";

const router = Router();

router.post("/register", isValid(validation.registerSchema), AuthService.register);
router.post("/login", AuthService.login);
router.post("/verify-otp", AuthService.verifyOTP);
router.post(
  "/register-with-google",
  isValid(validation.RegisterWithGoogleSchema),
  AuthService.registerWithGoogle
);
router.post("/verify-two-factor", isValid(validation.verifyTwoFactorSchema), AuthService.verifyTwoFactorOTP);
export default router;
