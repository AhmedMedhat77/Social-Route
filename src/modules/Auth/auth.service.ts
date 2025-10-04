import { Request, Response } from "express";
import {
  LoginDTO,
  RegisterDTO,
  RegisterWithGoogleDTO,
  VerifyOTPDTO,
  VerifyTwoFactorDTO,
} from "./auth.dto";
import { AuthFactoryService } from "./factory";
import {
  ConflictException,
  generateOTP,
  generateToken,
  NotFoundException,
  sendEmail,
} from "../../utils";
import { UserRepository } from "../../DB/models";
import { OAuth2Client } from "google-auth-library";
import config from "../../config";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();

  constructor() {}

  register = async (req: Request, res: Response) => {
    //1. get data from body
    const registerDTO: RegisterDTO = req.body;

    //2. check user already exists
    const isExists = await this.userRepository.isExists({
      $or: [{ email: registerDTO.email }, { phone: registerDTO.phone }],
    });

    if (isExists) {
      throw new ConflictException("User already exists");
    }
    //3. prepare data in factory
    const userData = await this.authFactoryService.register(registerDTO);
    // 4. create user
    const user = await this.userRepository.createUser(userData);
    //5. return response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  };

  verifyOTP = async (req: Request, res: Response) => {
    // DTO => Data to Object
    const verifyOTPDTO: VerifyOTPDTO = req.body;
    // 2. prepare data in factory
    const userData = await this.authFactoryService.verifyOTP(verifyOTPDTO);
    // 3. verify OTP
    const user = await this.userRepository.verifyOTP(userData);
    // 4. return response
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: user,
    });
  };

  login = async (req: Request, res: Response) => {
    // DTO => Data to Object
    const loginDTO: LoginDTO = req.body;
    // 2. prepare data in factory
    const userData = await this.authFactoryService.login(loginDTO);

    // 2.1 check if two factor is enabled
    const isTwoFactorEnabled = await this.userRepository.findOne({ email: loginDTO.email });

    // 2.2 if two factor is enabled, Generate OTP and send to email
    if (isTwoFactorEnabled?.twoFactorEnabled) {
      const twoFactorOTP = generateOTP().otp;
      const twoFactorOTPExpiry = generateOTP({ expiryTime: 5 * 60 * 60 * 1000 }).otpExpiry;

      await this.userRepository.updateOne(
        { email: loginDTO.email },
        { twoFactorSecret: twoFactorOTP, otpExpiresAt: twoFactorOTPExpiry }
      );

      // 2.3 send OTP to email
      await sendEmail({
        to: loginDTO.email,
        subject: "Please verify your email By OTP",
        text: `Your OTP is ${twoFactorOTP}`,
      });
      // 2.4 return response
      return res.status(200).json({
        success: true,
        message: "Please verify your email By OTP",
        data: "Please verify your email By OTP",
      });
    }

    // 3. login
    const user = await this.userRepository.login(userData);
    // 4. return response
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: user,
    });
  };

  verifyTwoFactorOTP = async (req: Request, res: Response) => {
    const verifyTwoFactorDTO: VerifyTwoFactorDTO = req.body;
    // 1. check if OTP is valid
    const isOTPValid = await this.userRepository.findOne({ email: verifyTwoFactorDTO.email });

    if (!isOTPValid) {
      throw new NotFoundException("User not found");
    }

    // 2. check if OTP is expired
    if (isOTPValid.twoFactorExpiry < new Date()) {
      throw new ConflictException("OTP has expired Please Try Again");
    }
    // 2.1 check if OTP is valid
    if (isOTPValid.twoFactorSecret !== verifyTwoFactorDTO.twoFactorSecret) {
      throw new ConflictException("Invalid OTP Please Try Again");
    }

    // 2.2 update two factor
    await this.userRepository.updateOne(
      { email: verifyTwoFactorDTO.email },
      { twoFactorSecret: undefined, twoFactorExpiry: undefined }
    );

    const user = await this.userRepository.findOne({ email: verifyTwoFactorDTO.email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const token = generateToken(
      { _id: user._id },
      { expiresIn: config.ACCESS_TOKEN_TIME }
    );
    const refreshToken = generateToken(
      { _id: user._id },
      { expiresIn: config.REFRESH_TOKEN_TIME }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: { user: user, token, refreshToken },
    });
  };

  registerWithGoogle = async (req: Request, res: Response) => {
    const oauth2Client = new OAuth2Client();

    const registerWithGoogleDTO: RegisterWithGoogleDTO = req.body;
    const ticket = await oauth2Client.verifyIdToken({
      idToken: registerWithGoogleDTO.googleId!,
      audience: config.GOOGLE_AUTH_CLIENT,
    });

    const { name, email, picture } = ticket.getPayload()!;

    //2. prepare data in factory
    const userData = await this.authFactoryService.registerWithGoogle({
      googleId: registerWithGoogleDTO.googleId,
      name,
      email,
      picture,
    });

    //3. create user
    const user = await this.userRepository.registerWithGoogle(userData);

    //4. return response
    res.status(201).json({
      success: true,
      message: "User registered with Google successfully",
      data: user,
    });
  };
}

export default new AuthService();
