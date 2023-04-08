import { model, Schema } from "mongoose";

export interface IAllowedUser {
  uuid: string;
  allowedUsers: string[]
}

const allowedUsersSchema = new Schema({
  uuid: String,
  allowedUsers: Array
});

export default model<IAllowedUser>('AllowedUser', allowedUsersSchema);
