import { IDocumentMetadata } from "../../model/blockchain.model"
import { Block, IBlockProps } from "./block.class";
import { BlockChainDatabaseBridge } from "./blockchainDBbridge.class";

export class BlockChain {

  private readonly chain: Readonly<Block>[] = [];

  constructor() {
    BlockChainDatabaseBridge.retrieveAllBlocksFromDatabase().then(data => this.initWithData(data as any));
  }

  public async initWithData(data: Readonly<Block>[]): Promise<void> {
    this.chain.push(...(data || []));

    if (!this.chain.length) {
      //add genesis block
      await this.addBlock(new Block({} as IBlockProps, {} as IDocumentMetadata));
    }
  }

  public async addBlock(block: Block): Promise<boolean> {
    console.log('[INFO] Block is adding...');

    this.chain.push(Object.freeze(block));

    if (block.isValid(block.nonce)) {
      const isSaved = await BlockChainDatabaseBridge.saveBlock(block);
      console.log('[INFO] Block added successfully!');
      return isSaved;
    } else {
      this.chain.pop();
      throw new Error('[ERROR] The Blockchain is Invalid!');
    }

  }

  public async getBlockByUUID(uuid: string): Promise<Block> {
    return await BlockChainDatabaseBridge.retrieveBlockByUUID(uuid) as unknown as Block;
  }

  public async getBlocksByOriginUser(originUser: string): Promise<Block[]> {
    return await BlockChainDatabaseBridge.retrieveBlocksForOriginUser(originUser) as unknown as Block[];
  }

  public get isValid(): boolean {
    return this.chain.every((block, i) =>
      i === 0 ||
      (
        this.chain[i - 1].hash === block.prevHash && // check if prev block hash equal to current hash
        (
          this.chain[i + 1]
            ? this.chain[i + 1].prevHash === block.hash // check if next block hash equal to current hash
            : block instanceof Block && block.isValid(block.nonce) //check if new block hash is valid
        )
      )
    );
  }

  public get lastBlock(): Block {
    return <Block>this.chain.at(-1);
  }
}
