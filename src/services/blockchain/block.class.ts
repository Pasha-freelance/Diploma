import { IBlock, IDocumentMetadata } from "../../model/blockchain.model";
import crypto, { randomUUID } from "crypto";
import { IContractDto, ITransactionDto } from "../../interfaces/transaction-dto.interface";

export interface IBlockProps {
  userId: string;
}

export class Block implements IBlock {

  public hash: string = '';
  public prevHash: string = '';
  public nonce: string = '';
  public readonly docMetadata: IDocumentMetadata;
  public readonly originUser: string;
  public readonly uuid: string;
  public timestamp: number = 0;
  public address: string = '';

  private readonly NETWORK_POWER = 10000;

  constructor(
    private _data: IBlockProps,
    private docData: IDocumentMetadata
  ) {
    this.docMetadata = this.docData;
    this.originUser = this._data.userId;
    this.uuid = randomUUID();
    console.log(`[INFO] Block instance is created`);
  }

  public isValid(prevHash: string): boolean {
    return true;
    //return this.prevHash === prevHash;
  }

  public updateWithTx(data: ITransactionDto): void {
    this.hash = data.hash;
    this.prevHash = data.prevHash;
    this.timestamp = data.timestamp;
    this.nonce = data.nonce;
    this.address = data.address;
    console.log(`[INFO] Block with hash ${this.hash} updated with transaction!`);
  }

  public get dataForContract(): IContractDto {
    return {
      originUser: this.originUser,
      uuid: this.uuid,
      docMetadata: this.docMetadata
    }
  }
}

// private initHash(): void {
//   const { hash, nonce } = this._hash;
//   this.hash = hash;
//   this.nonce = nonce;
// }

// private getCryptoHash(nonce: number): string {
//   return crypto.createHash('sha256').update(this.hashProps + nonce).digest('hex');
// }
//
// private get hashProps(): string {
//   return this.prevHash + this.timestamp;
// }
//
// private convertNumberToCharCodesString(num: number): number {
//   return +num.toString().split('').map(c => c.charCodeAt(0)).join('');
// }
//
// private get _hash(): { hash: string; nonce: number; } {
//   let counter = 0;
//   let nonce = 0;
//   let hash = '';
//   const endCount = Math.floor(Math.log10(this.NETWORK_POWER));
//   const target = '0'.repeat(endCount);
//
//   /**
//    * Proof of Work
//    **/
//   do {
//     counter++;
//     nonce = this.convertNumberToCharCodesString(counter)
//     hash = this.getCryptoHash(nonce)
//   } while (hash.substring(0, endCount) !== target);
//
//   return { hash, nonce };
// }
