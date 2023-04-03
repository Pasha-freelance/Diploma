import BlockModel from "../../model/blockchain.model";
import { Block } from "./block.class";

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
    const block = BlockModel.findOne({ uuid: uuid }) as unknown as Block;
    console.log(`[INFO] Retrieved block with uuid: ${uuid}, its hash: ${block.hash}`)
    return block;
  }

  public static async saveBlock(block: Block): Promise<boolean> {
    const model = new BlockModel(block);
    await model.save();
    return true;
  }
}
