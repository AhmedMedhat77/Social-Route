import { Router } from "express";
import { AuthMiddleware, isValid } from "../../middleware";

import * as validation from "./validation";
import friendService from "./friend.service";

const router = Router();
router.use(AuthMiddleware());

router.get("/", friendService.getFriends);

router.post("/block-user", isValid(validation.blockUserValidation), friendService.blockUser);

router.post("/add-friend", isValid(validation.friendIDValidation), friendService.addFriend);

router.post("/remove-friend", isValid(validation.friendIDValidation), friendService.removeFriend);

router.patch(
  "/cancel-friend-request",
  isValid(validation.friendIDValidation),
  friendService.cancelFriendRequest
);

router.patch(
  "/send-friend-request",
  isValid(validation.friendIDValidation),
  friendService.sendFriendRequest
);

router.post(
  "/accept-friend-request",
  isValid(validation.friendIDValidation),
  friendService.acceptFriendRequest
);

export default router;
