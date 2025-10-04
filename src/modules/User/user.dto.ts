import { GENDER_ENUM, IUser, ROLE_ENUM } from "../../utils";

export interface IUserDTO extends Partial<IUser> {
  firstName?: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  dob?: Date;
  age?: number;
  gender?: GENDER_ENUM;
  isVerified: boolean;
  isDeleted: boolean;
  role: ROLE_ENUM;
  credentialsUpdatedAt: Date;
  otp?: string;
  otpExpiresAt?: Date;
  otpAttempts: number;

  //   for auth service
  oldPassword?: string;
}

export interface UpdatePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateEmailDTO {
  email: string;
}