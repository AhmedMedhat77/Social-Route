import { NextFunction, Request, Response } from "express";
import { IUser, UnauthorizedException, verifyToken } from "../../utils";
import { UserRepository } from "../../DB";

interface ITokenUser {
  _id: string;
  email: string;
}

export const AuthMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { _id, email } = decoded;

    const userRepository = new UserRepository();
    const user = await userRepository.isExists({ _id: _id });

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    req.user = { _id: _id, email } as unknown as IUser;

    next();
  };
};
