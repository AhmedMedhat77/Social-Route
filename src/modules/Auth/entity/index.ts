import { AGENT_ENUM, GENDER_ENUM, ROLE_ENUM } from "../../../utils/common/enum";

export class User {
  public fullName?: string;
  public avatar?: string;

  public firstName!: string;
  public lastName!: string;

  public email!: string;
  public phone!: string;
  public password!: string;

  public dob!: Date;
  public age!: number;

  public gender!: GENDER_ENUM;
  public isVerified!: boolean;

  public userAgent!: AGENT_ENUM;
  public role!: ROLE_ENUM;

  public credentialsUpdatedAt!: Date;
  public otp!: string;
  public otpExpiresAt!: Date;
  public otpAttempts!: number;

  public googleId!: string;
}
