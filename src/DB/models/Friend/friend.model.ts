import { model } from "mongoose";
import { IFriends } from "../../../utils/common/interfaces/Friends";
import { friendSchema } from "./friend.schema";

export const friendModel = model<IFriends>("Friend", friendSchema);
