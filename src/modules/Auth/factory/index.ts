import { AGENT_ENUM, ROLE_ENUM } from "../../../utils/common/enum";
import { hashPassword, hashPhoneNumber } from "../../../utils/hash";
import { generateOTP } from "../../../utils/OTP";
import { LoginDTO, RegisterDTO, RegisterWithGoogleDTO, VerifyOTPDTO } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
  register = async (registerDTO: RegisterDTO) => {
    // Take  new instance of User Entity from ./entity/index.ts
    const userEntity = new User();

    userEntity.fullName = registerDTO.fullName;
    userEntity.firstName = registerDTO.fullName.split(" ")[0];
    userEntity.lastName = registerDTO.fullName.split(" ")[1];
    userEntity.avatar = registerDTO.avatar;
    userEntity.email = registerDTO.email!;
    // Only hash phone if it exists
    userEntity.phone = registerDTO.phone ? await hashPhoneNumber(registerDTO.phone) : "";
    userEntity.password = await hashPassword(registerDTO.password);
    userEntity.userAgent = AGENT_ENUM.local;
    userEntity.role = ROLE_ENUM.USER;
    userEntity.isVerified = false;
    userEntity.credentialsUpdatedAt = new Date();
    userEntity.otp = generateOTP().otp;
    userEntity.otpExpiresAt = generateOTP({ expiryTime: 5 * 60 * 60 * 1000 }).otpExpiry;
    userEntity.otpAttempts = 0;
    userEntity.dob = registerDTO.dob;
    userEntity.gender = registerDTO.gender;
    return userEntity;
  };

  verifyOTP = async (verifyOTPDTO: VerifyOTPDTO) => {
    const userEntity = new User();
    userEntity.email = verifyOTPDTO.email;
    userEntity.otp = verifyOTPDTO.otp;

    return userEntity;
  };
  login = async (loginDTO: LoginDTO) => {
    const userEntity = new User();
    userEntity.email = loginDTO.email;
    userEntity.password = loginDTO.password;
    return userEntity;
  };
  registerWithGoogle = async (googleData: RegisterWithGoogleDTO) => {
    const userEntity = new User();

    // Set Google-specific data
    userEntity.googleId = googleData.googleId;
    userEntity.userAgent = AGENT_ENUM.google;
    userEntity.role = ROLE_ENUM.USER;
    userEntity.isVerified = true; // Google users are pre-verified
    userEntity.fullName = googleData.name;
    userEntity.avatar = googleData.picture;
    userEntity.email = googleData.email!;
    // Optional: Set default values for Google users
    userEntity.otpAttempts = 0;

    return userEntity;
  };
}
