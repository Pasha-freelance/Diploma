import AllowedUserModel from "../../model/allowed-users.model";
import User from "../../model/user.model";
import { IUser } from "../../interfaces/registration-dto.interface";
import { evaluateContractMethod } from "../../smart-contracts/deploy";

export class AllowedUsersService {

  public static async attach(uuid: string, address: string, allowedUsersProfileIds: string[]): Promise<void> {
    if (!allowedUsersProfileIds) {
      allowedUsersProfileIds = [];
    }
    console.log(`[INFO] Allowed Users for block ${uuid} adding...`);
    const res = new AllowedUserModel({ uuid, allowedUsers: allowedUsersProfileIds });
    await res.save();
    await evaluateContractMethod(address, 'attachAllowedUsers', allowedUsersProfileIds);
    console.log(`[INFO] Allowed Users for block ${uuid} Added...`);
    return;
  }

  public static async getUsersToAttach(userId: string, email: string): Promise<IUser[]> {
    if (!email) {
      return [];
    }
    const users = await User.find({
      email: {
        $regex: `^${email}.*`
      },
      userId: {
        $not: { $regex: `^${userId}.*` }
      }
    });
    return users;
  }
}
