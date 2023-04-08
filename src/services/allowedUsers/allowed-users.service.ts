import AllowedUserModel from "../../model/allowed-users.model";

export class AllowedUsersService {

  public static async attach(uuid: string, allowedUsers: string[]): Promise<void> {
    if (!allowedUsers) {
      allowedUsers = [];
    }
    console.log(`[INFO] Allowed Users for block ${uuid} adding...`);
    const res = new AllowedUserModel({ uuid, allowedUsers });
    await res.save();
    console.log(`[INFO] Allowed Users for block ${uuid} Added...`);
    return;
  }
}
