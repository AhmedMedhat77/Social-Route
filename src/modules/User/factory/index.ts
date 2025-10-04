import { IUserDTO, UpdateEmailDTO, UpdatePasswordDTO } from "../user.dto";
import { User } from "../entity";
import { hashPassword } from "../../../utils";

export class UserFactoryService {
  updatePassword = async (updatePasswordDTO: UpdatePasswordDTO) => {
    const userEntity = new User();
    // hash the new password
    userEntity.password = await hashPassword(updatePasswordDTO.newPassword);
    userEntity.oldPassword = updatePasswordDTO.oldPassword;
    return userEntity;
  };
  updateEmail = async (updateEmailDTO: UpdateEmailDTO) => {
    const userEntity = new User();
    userEntity.email = updateEmailDTO.email;
    return userEntity;
  };
}
