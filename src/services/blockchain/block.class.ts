import { IBlock, IDocumentMetadata } from "../../model/blockchain.model";
import crypto, { randomUUID } from "crypto";

export interface IBlockProps {
  userId: string;
  prevHash: string;
}

export class Block implements IBlock {

  public hash!: string;
  public prevHash!: string;
  public nonce!: number;
  public readonly docMetadata: IDocumentMetadata;
  public readonly originUser: string;
  public readonly uuid: string;
  public readonly timestamp: string;

  public readonly NETWORK_POWER = 10000;

  constructor(
    private data: IBlockProps,
    private docData: IDocumentMetadata
  ) {
    this.docMetadata = this.docData;
    this.originUser = this.data.userId;
    this.timestamp = Date.now().toString();
    this.prevHash = this.data.prevHash;
    this.uuid = randomUUID();
    this.initHash();
    console.log(`[INFO] Block with hash ${this.hash} created`);
  }

  private initHash(): void {
    const { hash, nonce } = this._hash;
    this.hash = hash;
    this.nonce = nonce;
  }

  public isValid(nonce: number): boolean {
    return this.hash === this.getCryptoHash(nonce) && this.nonce === nonce;
  }

  protected getCryptoHash(nonce: number): string {
    return crypto.createHash('sha256').update(this.hashProps + nonce).digest('hex');
  }

  protected get hashProps(): string {
    return this.prevHash + this.timestamp;
  }

  protected convertNumberToCharCodesString(num: number): number {
    return +num.toString().split('').map(c => c.charCodeAt(0)).join('');
  }

  protected get _hash(): {hash: string; nonce: number;} {
    let counter = 0;
    let nonce = 0;
    let hash = '';
    const endCount = Math.floor(Math.log10(this.NETWORK_POWER));
    const target = '0'.repeat(endCount);

    /**
     * Proof of Work
     **/
    do {
      counter++;
      nonce = this.convertNumberToCharCodesString(counter)
      hash = this.getCryptoHash(nonce)
    } while (hash.substring(0, endCount) !== target);

    return { hash, nonce };
  }
}
