import AllowedUserModel from "../../model/allowed-users.model";
import User from "../../model/user.model";
import { IUser } from "../../interfaces/registration-dto.interface";
import { evaluateContractMethod } from "../../smart-contracts/deploy";
import AllowedUsersModel from "../../model/allowed-users.model";

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

  public static async edit(uuid: string, address: string, allowedUsersProfileIds: string[]): Promise<void> {
    console.log(`[INFO] Allowed Users for block ${uuid} adding...`);
    const res = await AllowedUserModel.updateOne({ uuid },{ uuid, allowedUsers: allowedUsersProfileIds });
    await evaluateContractMethod(address, 'attachAllowedUsers', allowedUsersProfileIds);
    console.log(`[INFO] Allowed Users for block ${uuid} Added...`);
    return;
  }

  public static async getAllowedUsersForBlock(uuid: string): Promise<IUser[]> {
    if(!uuid) {
      return [];
    }
    const ids = await AllowedUsersModel.findOne({ uuid }, 'allowedUsers');
    const users = await User.find({
      userId: {
        $in: ids?.allowedUsers || []
      }
    });

    return users;
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
