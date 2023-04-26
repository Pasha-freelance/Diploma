import { IDocumentMetadata } from "../../model/blockchain.model";
import { DocumentDatabaseBridge } from "./documentDBbridge.class";
import crypto from "crypto";

export class DigitalDocument {

  private hash: string = '';
  public readonly file: Buffer;

  constructor(
    private _file: Express.Multer.File,
    private timestamp: number,
    private blockHash: string,
    private originUser: string
  ){
    this.file = this._file.buffer;
    this.hash = DigitalDocument.getDocHash(DigitalDocument.metadata(_file), timestamp, blockHash, originUser);
  }

  public static metadata(file: Express.Multer.File): IDocumentMetadata {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype
    };
  }

  public static getDocHash(
    metadata: IDocumentMetadata,
    timestamp: number,
    blockHash: string,
    originUser: string
  ): string {
    return crypto
      .createHash('sha256')
      .update(metadata.mimetype)
      .update(metadata.originalname)
      .update(blockHash)
      .update(originUser)
      .digest('hex');
  }

  public saveDocument(): Promise<void> {
    return DocumentDatabaseBridge.saveDocument(this);
  }
}
