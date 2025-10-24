import { Socket } from "socket.io";
import { IUser } from "../../utils";

export const usePublicMessage = (
  socket: Socket,
  socketIdToUserId: Map<string, string>,
  userIdToUserInfo: Map<string, Partial<IUser> & { connectionCount: number }>
) => {
  socket.on("public_message", (data) => {
    const user = userIdToUserInfo.get(socketIdToUserId.get(socket.id) || "");
    if (user) {
      socket.broadcast.emit("public_message", {
        message: data.message,
        fullName: user.fullName,
        senderId: user._id,
      });
    }
  });
};
