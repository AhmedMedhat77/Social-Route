import { Socket } from "socket.io";
import { IUser } from "../../utils";

export const useTyping = (
  socket: Socket,
  socketIdToUserId: Map<string, string>,
  userIdToUserInfo: Map<string, Partial<IUser> & { connectionCount: number }>
) => {
  socket.on("typing", (data) => {
    const user = userIdToUserInfo.get(socketIdToUserId.get(socket.id) || "");
    if (user) {
      socket.broadcast.emit("user_typing", {
        userId: user._id,
        fullName: user.fullName,
        isTyping: data.isTyping,
      });
    }
  });
};
