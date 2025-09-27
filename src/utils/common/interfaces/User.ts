import { ObjectId } from "mongoose";
import { GENDER_ENUM, AGENT_ENUM, ROLE_ENUM } from "../enum";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;

  email?: string;
  phone?: string;
  password?: string;

  dob?: Date;
  age?: number;

  gender?: GENDER_ENUM;

  isVerified: boolean;
  isDeleted: boolean;

  userAgent: AGENT_ENUM;

  role: ROLE_ENUM;

  credentialsUpdatedAt: Date;
  otp?: string;
  otpExpiresAt?: Date;
  otpAttempts: number;
}

// REOPEN IUSER Concept
export interface IUser {
  _id: ObjectId;
}
