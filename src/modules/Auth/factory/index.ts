import { AGENT_ENUM, ROLE_ENUM } from "../../../utils/common/enum";
import { hashPassword, hashPhoneNumber } from "../../../utils/hash";
import { generateOTP } from "../../../utils/OTP";
import { LoginDTO, RegisterDTO, VerifyOTPDTO } from "../auth.dto";
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
    userEntity.phone = await hashPhoneNumber(registerDTO.phone!);
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
}

export class VerifyOTPFactoryService {
  verifyOTP = async (verifyOTPDTO: VerifyOTPDTO) => {
    const userEntity = new User();
    userEntity.email = verifyOTPDTO.email;
    userEntity.otp = verifyOTPDTO.otp;
    return userEntity;
  };
}

export class LoginFactoryService {
  login = async (loginDTO: LoginDTO) => {
    const userEntity = new User();
    userEntity.email = loginDTO.email;
    userEntity.password = loginDTO.password;
    return userEntity;
  };
}
