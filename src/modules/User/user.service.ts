import { Request, Response } from "express";
import { UserRepository } from "../../DB";
import { ObjectId } from "mongoose";
import {
  comparePassword,
  ConflictException,
  generateOTP,
  NotFoundException,
  sendEmail,
} from "../../utils";
import { UserFactoryService } from "./factory";
import { UpdateBasicInfoDTO, UpdateEmailDTO, UpdatePasswordDTO } from "./user.dto";
import { VerifyOTPDTO } from "../Auth";

export class UserService {
  private userRepository = new UserRepository();
  private userFactoryService = new UserFactoryService();
  constructor() {}

  getUser = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const user = await this.userRepository.findOne(
      { _id },
      "-password -otp -otpExpiresAt -otpAttempts"
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  };

  updatePassword = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const updatePasswordDTO: UpdatePasswordDTO = req.body;

    // 2. prepare data in factory
    const passwordData = await this.userFactoryService.updatePassword(updatePasswordDTO);
    console.log(passwordData);

    // 3. check user exists
    const user = await this.userRepository.isExists({ _id });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // 4. validation on old password if it's matching
    const isMatching = await comparePassword(passwordData.oldPassword!, user.password!);
    if (!isMatching) {
      throw new ConflictException("Invalid old password");
    }

    // 5. update password
    const updatedUser = await this.userRepository.updateOne(
      { _id },
      { password: passwordData.password, credentialsUpdatedAt: new Date() }
    );
    // 6. return response
    res.status(201).json({
      success: true,
      message: "Password updated successfully",
      data: "Done",
    });
  };

  updateEmail = async (req: Request, res: Response) => {
    const _id = req.user._id;
    // 1. get data from body
    const updateEmailDTO: UpdateEmailDTO = req.body;
    // 2. prepare data in factory
    const emailData = await this.userFactoryService.updateEmail(updateEmailDTO);
    // 3. check if email is already exists for other user
    const user = await this.userRepository.isExists({
      email: emailData.email,
      _id: { $ne: _id },
    });

    if (user) {
      throw new ConflictException("Email already exists");
    }

    // 3.1 generate OTP
    const otp = generateOTP().otp;
    const otpExpiry = generateOTP({ expiryTime: 5 * 60 * 60 * 1000 }).otpExpiry;

    // 3.2 update OTP and OTP expiry
    await this.userRepository.updateOne({ _id }, { otp: otp, otpExpiresAt: otpExpiry });

    // 4. send email to user
    await sendEmail({
      to: emailData.email,
      subject: "Please verify your email By OTP",
      text: `Your OTP is ${otp}`,
    });

    // 5. return response
    res.status(201).json({
      success: true,
      message: "OTP sent To Your email Please Verify",
    });
  };

  verifyOTP = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const verifyOTPDTO: VerifyOTPDTO = req.body;

    // 2. check if OTP is valid
    const user = await this.userRepository.isExists({ _id, otp: verifyOTPDTO.otp });

    if (!user) {
      throw new NotFoundException("Invalid OTP");
    }

    if (user?.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new ConflictException("OTP has expired");
    }

    // 3. update user
    await this.userRepository.updateOne(
      { _id },
      { otp: undefined, otpExpiresAt: undefined, otpAttempts: 0, email: verifyOTPDTO.email }
    );
    // 4. return response
    res.status(200).json({
      success: true,
      message: `updated successfully Your email is ${verifyOTPDTO.email} `,
    });
  };

  twoFactorAuth = async (req: Request, res: Response) => {
    const _id = req.user._id;

    const enable = req.body.enable;

    // find one and update two factor enabled & reset two factor secret and expiry
    const user = await this.userRepository.updateOne(
      { _id },
      { twoFactorEnabled: enable, twoFactorSecret: undefined, twoFactorExpiry: undefined }
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    res.status(201).json({
      success: true,
      message: `Two factor authentication updated successfully ${enable ? "enabled" : "disabled"}`,
      data: user,
    });
  };

  updateBasicInfo = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const updateBasicInfoDTO: UpdateBasicInfoDTO = req.body;

    let dataToUpdate: UpdateBasicInfoDTO = {};

    Object.entries(updateBasicInfoDTO).forEach(([key, value]) => {
      if (value) {
        dataToUpdate[key as keyof UpdateBasicInfoDTO] = value;
      }
    });

    const user = await this.userRepository.updateOne({ _id }, dataToUpdate);

    res.status(201).json({
      success: true,
      message: "Basic info updated successfully",
      data: user,
    });
  };
}

export default new UserService();
