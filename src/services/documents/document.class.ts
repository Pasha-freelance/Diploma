import { IDocumentMetadata } from "../../model/blockchain.model";
import { DocumentBridge } from "../blockDocumentBridge.class";
import { DocumentDatabaseBridge } from "./documentDBbridge.class";

export class DigitalDocument {

  private readonly hash: string = '';
  public readonly file: Buffer;

  constructor(
    private _file: Express.Multer.File
  ){
    this.hash = DocumentBridge.getDocHash(this.metadata);
    this.file = this._file.buffer;
  }

  public get metadata(): IDocumentMetadata {
    return {
      originalname: this._file.originalname,
      mimetype: this._file.mimetype
    }
  }

  public addDocument(): Promise<void> {
    return DocumentDatabaseBridge.saveDocument(this)
  }
}
