import { Request, Response } from "express";
import { LoginDTO, RegisterDTO, VerifyOTPDTO } from "./auth.dto";
import { UserRepository } from "../../DB/models/User/user.repository";
import { ConflictException } from "../../utils/error/AppError";
import { AuthFactoryService, LoginFactoryService, VerifyOTPFactoryService } from "./factory";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  private verifyOTPFactoryService = new VerifyOTPFactoryService();
  private loginFactoryService = new LoginFactoryService();
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
    const userData = await this.verifyOTPFactoryService.verifyOTP(verifyOTPDTO);
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
    const userData = await this.loginFactoryService.login(loginDTO);
    // 3. login
    const user = await this.userRepository.login(userData);
    // 4. return response
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: user,
    });
  };
}

export default new AuthService();
