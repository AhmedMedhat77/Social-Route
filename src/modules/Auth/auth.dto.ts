import { GENDER_ENUM } from "../../utils/common/enum";

// DTO => Data to Object

export interface RegisterDTO {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  gender: GENDER_ENUM;
  avatar?: string;
  dob: Date;
  firstName?: string;
  lastName?: string;
}

export interface updateUserDTO extends Partial<RegisterDTO> {}

export interface VerifyOTPDTO {
  email: string;
  otp: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterWithGoogleDTO {
  googleId: string;
  name?: string;
  email?: string;
  picture?: string;
}

export interface VerifyTwoFactorDTO {
  email: string;
  twoFactorSecret: string;
}
