import { IDocumentMetadata } from "../../model/blockchain.model";
import crypto, { randomUUID } from "crypto";

export interface IBlockProps {
  userId: string;
  uuid: string;
}

export class Block {

  public readonly hash: string = '';
  public readonly docMetadata: IDocumentMetadata = {} as IDocumentMetadata;
  public prevHash: string = '';

  private readonly originUser: string = '';
  private readonly uuid: string = '';
  private readonly timestamp: string = '';

  constructor(
    private data: IBlockProps,
    private docData: IDocumentMetadata
  ) {
    this.docMetadata = this.docData;
    this.originUser = this.data.userId;
    this.uuid = this.data.uuid;
    this.timestamp = Date.now().toString();
    this.hash = this.calcHash();
    this.uuid = randomUUID();
  }

  private calcHash(): string {
    return crypto
      .createHash('sha256')
      .update(this.prevHash || '')
      .update(this.timestamp)
      .digest('hex')
  }
}
