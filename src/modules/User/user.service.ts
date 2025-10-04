import { Request, Response } from "express";
import { UserRepository } from "../../DB";
import { ObjectId } from "mongoose";
import { comparePassword, ConflictException, NotFoundException } from "../../utils";
import { UserFactoryService } from "./factory";
import { UpdatePasswordDTO } from "./user.dto";

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


}

export default new UserService();
