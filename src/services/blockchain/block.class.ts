import { IDocumentMetadata } from "../../model/blockchain.model";
import crypto, { randomUUID } from "crypto";

export interface IBlockProps {
  userId: string;
  uuid: string;
}

export class Block {

  public hash: string = '';
  public readonly docMetadata: IDocumentMetadata = {} as IDocumentMetadata;
  public prevHash: string = '';
  public readonly originUser: string = '';
  public readonly uuid: string = '';
  public readonly timestamp: string = '';

  constructor(
    private data: IBlockProps,
    private docData: IDocumentMetadata
  ) {
    this.docMetadata = this.docData;
    this.originUser = this.data.userId;
    this.timestamp = Date.now().toString();
    this.recalculateHash();
    this.uuid = randomUUID();
  }

  public recalculateHash(): void {
    this.hash = this.getHash();
  }

  public get isHashValid(): boolean {
    return this.hash === this.getHash();
  }

  private getHash(): string {
    return crypto
      .createHash('sha256')
      .update(this.prevHash)
      .update(this.timestamp)
      .digest('hex')
  }
}
