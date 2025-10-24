import { Socket } from "socket.io";
import { MessageModel } from "../../DB";
import { IUser } from "../../utils";

interface ISendMessage {
  message: string;
  fullName: string;
  senderId: string;
  recipientId: string;
}
export const useSendPrivateMessage = async (
  socket: Socket,
  socketIdToUserId: Map<string, string>,
  userIdToUserInfo: Map<string, Partial<IUser> & { connectionCount: number }>
) => {
  socket.on("private_message", async (data: ISendMessage) => {
    const user = userIdToUserInfo.get(socketIdToUserId.get(socket.id) || "");
    if (user) {
      // Send to specific recipient
      const recipientSocket = Array.from(socketIdToUserId.entries()).find(
        ([_, userId]) => userId === data.recipientId
      )?.[0];

      // Save message to database
      await MessageModel.create({
        senderId: user._id,
        receiverId: data.recipientId,
        content: data.message,
      });

      if (recipientSocket) {
        socket.to(recipientSocket).emit("private_message", {
          message: data.message,
          fullName: user.fullName,
          senderId: user._id,
          recipientId: data.recipientId,
        });
      }

      // Also send back to sender for confirmation
      socket.emit("private_message", {
        message: data.message,
        fullName: user.fullName,
        senderId: user._id,
        recipientId: data.recipientId,
      });
    }
  });
};
