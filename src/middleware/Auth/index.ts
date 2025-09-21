import { NextFunction, Request, Response } from "express";

interface ITokenUser {
  _id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user: Partial<ITokenUser>;
    }
  }
}
export const AuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
