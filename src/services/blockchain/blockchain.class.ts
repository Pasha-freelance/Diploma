import { Block } from "./block.class";
import { BlockChainDatabaseBridge } from "./blockchainDBbridge.class";
import { deployContract, getGenesisBlock } from '../../smart-contracts/deploy';

export class BlockChain {

  private readonly chain: Readonly<Block>[] = [];

  constructor() {
    BlockChainDatabaseBridge.retrieveAllBlocksFromDatabase().then(data => this.initWithData(data as any));
  }

  public async initWithData(data: Readonly<Block>[]): Promise<void> {
    this.chain.push(...(data || []));

    if (!this.chain.length) {
      await this.initGenesisBlock();
    }
  }

  public async addBlock(block: Block): Promise<boolean> {
    console.log('[INFO] Block is adding...');

    const deployedTransaction = await deployContract(block.dataForContract);
    block.updateWithTx(deployedTransaction);

    const lastHash = this.chain.at(-1)?.hash as string;
    this.chain.push(Object.freeze(block));

    if (block.isValid(lastHash)) {
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

  private async initGenesisBlock(): Promise<void> {
    console.log('[INFO] Init genesis block...');
    const genesisBlock = new Block({ userId: ''}, { originalname: '', mimetype: '' });

    const deployedGenesisBlock = await getGenesisBlock();
    genesisBlock.updateWithTx(deployedGenesisBlock);

    this.chain.push(Object.freeze(genesisBlock));
    await BlockChainDatabaseBridge.saveBlock(genesisBlock);
    console.log('[INFO] Genesis block is initialized!');
  }

  public get lastBlock(): Block {
    return <Block>this.chain.at(-1);
  }
}
