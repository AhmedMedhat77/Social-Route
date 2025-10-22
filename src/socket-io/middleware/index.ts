import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils";
import { Server } from "socket.io";
import User from "../../DB/models/User/user.model";

export const SocketIOAuthMiddleware = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Received token:", token);

    if (!token) {
      console.log("No token provided");
      socket.data.user = null;
      return next();
    }
    // verify token
    try {
      const decoded = await verifyToken(token);

      if (!decoded || !decoded._id) {
        console.log("Invalid or missing token payload");
        socket.data.user = null;
        return next();
      }

      const user = await User.findById(decoded._id).select(
        "firstName lastName email phone avatar gender fullname"
      );

      socket.data.user = user;
      return next();
    } catch (error) {
      console.log("Token verification failed:", (error as Error).message);
      socket.data.user = null;
      return next();
    }
  });
};
