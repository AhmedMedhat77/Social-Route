import { IUserDTO, UpdatePasswordDTO } from "../user.dto";
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
}
