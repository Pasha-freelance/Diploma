import crypto from "crypto";
import { IDocumentMetadata } from "../model/blockchain.model";

export class DocumentBridge {
  public static getDocHash(metadata: IDocumentMetadata): string {
    return crypto
      .createHash('sha256')
      .update(metadata.mimetype)
      .update(metadata.originalname)
      .digest('hex')
  }
}
