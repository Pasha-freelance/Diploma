import { IDocumentMetadata } from "../../model/blockchain.model"
import { Block, IBlockProps } from "./block.class";
import { BlockChainDatabaseBridge } from "./blockchainDBbridge.class";

export class BlockChain {

  private readonly chain: Readonly<Block>[] = [];
  private readonly proofOfWorkTime = 1000;

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
    block.prevHash = this.lastBlock?.hash || '';
    block.recalculateHash();

    console.log('[INFO] Block is adding...');

    await this.proofOfWork();
    this.chain.push(Object.freeze(block));

    if (this.isValid) {
      const isSaved = await BlockChainDatabaseBridge.saveBlock(block);
      console.log('[INFO] Block added successfully!');
      return isSaved;
    } else {
      this.chain.pop();
      throw new Error('[ERROR] The Blockchain is Invalid!');
    }

  }

  private async proofOfWork(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.proofOfWorkTime));
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
            : block instanceof Block && block.isHashValid //check if new block hash is valid
        )
      )
    );
  }

  private get lastBlock(): Block {
    return <Block>this.chain.at(-1);
  }
}
