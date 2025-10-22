import { Router } from "express";
import MessageService from "./Message.service";
import { AuthMiddleware } from "../../middleware/Auth";

const router = Router();

// Apply auth middleware to all message routes
router.use(AuthMiddleware());

router.get("/:id", MessageService.getMessages);

export default router;