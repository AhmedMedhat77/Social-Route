import config from "../../../config";
import { IUser } from "../../../utils/common/interfaces/User";
import { sendEmail } from "../../../utils/email";
import { ConflictException, NotFoundException } from "../../../utils/error/AppError";
import { comparePassword } from "../../../utils/hash";
import { generateToken } from "../../../utils/jwt";
import { AbstractRepository } from "../../abstract.repository";
import User from "./user.model";
import { OAuth2Client } from "google-auth-library";

export class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(User);
  }
  async createUser(user: Partial<IUser>) {
    const createdUser = await this.create(user);
    await this.sendOTPMail(user);
    createdUser.otp = user.otp;
    createdUser.otpExpiresAt = user.otpExpiresAt;
    createdUser.save();
  }

  async sendOTPMail(user: Partial<IUser>) {
    if (!user.email) {
      throw new NotFoundException("Email is required");
    }
    return sendEmail({
      to: user.email,
      subject: "Please verify your email",
      text: `Your OTP is ${user.otp}`,
    });
  }

  async verifyOTP(user: Partial<IUser>) {
    if (!user.otp) {
      throw new NotFoundException("OTP is required");
    }

    const userExists = await this.isExists({ email: user.email });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    if (userExists.otpAttempts >= 5) {
      throw new ConflictException(
        "You have reached the maximum number of attempts. Please try again later"
      );
    }

    if (userExists.isVerified) {
      throw new ConflictException("User already verified");
    }

    if (userExists.otp !== user.otp && !userExists.isVerified) {
      userExists.otpAttempts++;
      await userExists.save();
      throw new ConflictException("Invalid OTP Please Try Again");
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new ConflictException("OTP has expired");
    }

    userExists.isVerified = true;
    userExists.otp = undefined;
    userExists.otpExpiresAt = undefined;
    userExists.otpAttempts = 0;
    await userExists.save();
    return userExists;
  }

  async login(user: Partial<IUser>) {
    if (!user.email) {
      throw new NotFoundException("Email is required");
    }
    if (!user.password) {
      throw new NotFoundException("Password is required");
    }

    const userExists = await this.isExists({ email: user.email });
    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    const hashPassword = await comparePassword(user.password!, userExists.password!);
    if (!hashPassword) {
      throw new ConflictException("Invalid User or Password");
    }

    const token = generateToken({ _id: userExists._id }, { expiresIn: config.ACCESS_TOKEN_TIME });

    const refreshToken = generateToken(
      { _id: userExists._id },
      {
        expiresIn: config.REFRESH_TOKEN_TIME,
      }
    );

    return { userExists, token, refreshToken };
  }

  async registerWithGoogle(user: Partial<IUser>) {
    const userExists = await this.isExists({ email: user.email });
    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const userData = await this.create(user);
    userData.save();
    return userData;
  }
}
