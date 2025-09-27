import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./interfaces";
export * from "./enum";
export * from "./interfaces";

export interface IPayload extends JwtPayload {
  _id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: Partial<IUser>;
    }
  }
}

export interface Request extends Express.Request {
  user: Partial<IUser>;
}