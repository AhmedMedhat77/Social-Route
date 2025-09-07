import { Router } from "express";
import AuthService from "./auth.service";

const router = Router();

router.post("/register", AuthService.register);
router.post("/login", AuthService.login);
router.post("/verify-otp", AuthService.verifyOTP);
export default router;
