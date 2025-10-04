import { GENDER_ENUM, ROLE_ENUM } from "../../../utils";

export class User {
  public firstName!: string;
  public lastName!: string;
  public fullName?: string;
  public avatar?: string;
  public email?: string;
  public phone?: string;
  public password?: string;
  public dob?: Date;
  public age?: number;
  public gender?: GENDER_ENUM;
  public isVerified!: boolean;
  public isDeleted!: boolean;
  public role!: ROLE_ENUM;
  public credentialsUpdatedAt!: Date;
  public otp?: string;
  public otpExpiresAt?: Date;
  public otpAttempts!: number;

  public oldPassword?: string;
}
