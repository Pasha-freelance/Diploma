import BlockModel, { IBlock } from "../../model/blockchain.model";
import { Block } from "./block.class";
import User from "../../model/user.model";
import AllowedUsersModel from "../../model/allowed-users.model";

export class BlockChainDatabaseBridge {

  public static async retrieveAllBlocksFromDatabase() {
    return BlockModel.find({});
  }

  public static async retrieveBlocksForOriginUser(originUser: string): Promise<Block[]> {
    console.log(`[INFO] Retrieving blocks for user: ${originUser} from db`);
    const blocks = BlockModel.find({ originUser }) as unknown as Block[];
    console.log(`[INFO] Blocks for user: ${originUser} retrieved successfully from db`);
    return blocks;
  }

  public static async retrieveBlockByUUID(uuid: string): Promise<Block> {
    console.log(`[INFO] Retrieving block with uuid: ${uuid} from db`);
    const block = await BlockModel.findOne({ uuid }) as unknown as Block;
    console.log(`[INFO] Retrieved block with uuid: ${uuid}, its hash: ${block.hash}`)
    return block;
  }

  public static async saveBlock(block: Block): Promise<boolean> {
    const model = new BlockModel(block);
    await model.save();
    return true;
  }

  public static async getAllowedBlocks(userId: string) {
    if (!userId) {
      return [];
    }
    const uuids = await AllowedUsersModel.find({ allowedUsers: { $in: userId } });
    const mapped = uuids.map(u => u.uuid);
    console.log(mapped)
    if(!mapped.length) {
      return [];
    }
    const documents = await BlockModel.find({uuid: { $in: mapped }});
    console.log(documents)
    return documents;
  }
}
