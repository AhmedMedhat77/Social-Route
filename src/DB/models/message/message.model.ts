import { model } from "mongoose";
import { messageSchema } from "./message.schema";
import { IMessage } from "../../../utils";

export const MessageModel = model<IMessage>("Message", messageSchema);
