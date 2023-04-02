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

  public async addBlock(block: Block): Promise<void> {
    block.prevHash = this.lastBlock?.hash || '';
    console.log('[INFO] Block is adding...');

    await this.proofOfWork();
    this.chain.push(Object.freeze(block));

    if (this.isValid) {
      await BlockChainDatabaseBridge.saveBlock(block);
      console.log('[INFO] Block added successfully!');
    } else {
      this.chain.pop();
      throw new Error('[ERROR] The Block chain is Invalid!');
    }

  }

  private async proofOfWork(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.proofOfWorkTime));
  }

  public async getBlockByUUID(uuid: string): Promise<Block> {
    return await BlockChainDatabaseBridge.retrieveBlockByUUID(uuid) as unknown as Block;
  }

  public get isValid(): boolean {
    return this.chain.every((block, i) =>
      (
        i >= 1 &&
        this.chain[i - 1].hash === block.prevHash &&
        (
          this.chain[i + 1]
            ? this.chain[i + 1].prevHash === block.hash
            : true
        )
      ) ||
      (
        i === 0
      )
    )
  }

  private get lastBlock(): Block {
    return <Block>this.chain.at(-1);
  }
}
