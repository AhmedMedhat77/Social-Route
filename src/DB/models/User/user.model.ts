import { model } from "mongoose";
import { IUser } from "../../../utils/common/interfaces/User";
import { userSchema } from "./user.schema";

const User = model<IUser>("User", userSchema);

export default User;
