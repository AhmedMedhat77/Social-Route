import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketIOAuthMiddleware } from "./middleware";
import { IUser } from "../utils";
import { MessageModel } from "../DB";

// Track socketId -> userId and aggregate users by userId to avoid duplicates
const socketIdToUserId = new Map<string, string>();
const userIdToUserInfo = new Map<string, Partial<IUser> & { connectionCount: number }>();

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  //* Middleware for socket io authentication
  SocketIOAuthMiddleware(io);

  io.on("connection", (socket) => {
    const authUser = socket.data.user;
    if (authUser && authUser._id) {
      const userId = authUser._id.toString();
      socketIdToUserId.set(socket.id, userId);

      const existing = userIdToUserInfo.get(userId);
      if (existing) {
        userIdToUserInfo.set(userId, {
          ...existing,
          connectionCount: existing.connectionCount + 1,
        });
      } else {
        userIdToUserInfo.set(userId, {
          _id: userId,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          fullName: authUser.fullname,
          avatar: authUser.avatar,
          email: authUser.email,
          phone: authUser.phone,
          gender: authUser.gender,
          isVerified: authUser.isVerified,
          connectionCount: 1,
        });
        // Announce only on first presence
        socket.broadcast.emit("user_joined", {
          _id: userId,
          fullName: authUser.fullname,
          avatar: authUser.avatar,
        });
      }

      // Emit de-duplicated users list
      const users = Array.from(userIdToUserInfo.values()).map(({ connectionCount, ...u }) => u);
      io.emit("connected_users", users);
    }

    // Per-socket handler: get_connected_users
    socket.on("get_connected_users", () => {
      const users = Array.from(userIdToUserInfo.values()).map(({ connectionCount, ...u }) => u);
      socket.emit("connected_users", users);
    });

    // Chat message handlers
    socket.on("public_message", (data) => {
      const user = userIdToUserInfo.get(socketIdToUserId.get(socket.id) || "");
      if (user) {
        io.emit("public_message", {
          message: data.message,
          fullName: user.fullName,
          senderId: user._id,
        });
      }
    });

    socket.on("private_message", async (data) => {
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
          io.to(recipientSocket).emit("private_message", {
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

    // Typing indicator
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

    // Cleanup on this socket disconnect
    socket.on("disconnect", () => {
      const userId = socketIdToUserId.get(socket.id);
      if (!userId) return;

      socketIdToUserId.delete(socket.id);
      const existing = userIdToUserInfo.get(userId);
      if (!existing) return;

      const nextCount = existing.connectionCount - 1;
      if (nextCount <= 0) {
        userIdToUserInfo.delete(userId);
        socket.broadcast.emit("user_left", {
          _id: existing._id,
          fullName: existing.fullName,
          avatar: existing.avatar,
        });
      } else {
        userIdToUserInfo.set(userId, { ...existing, connectionCount: nextCount });
      }

      const users = Array.from(userIdToUserInfo.values()).map(({ connectionCount, ...u }) => u);
      io.emit("connected_users", users);
    });
  });
};
