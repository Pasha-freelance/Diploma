import DocumentModel from "../../model/document.model";
import { IDocumentMetadata } from "../../model/blockchain.model";
import { DigitalDocument } from "./document.class";

export class DocumentDatabaseBridge {

  public static async retrieveDocumentFromDatabase(
    metadata: IDocumentMetadata,
    timestamp: string,
    blockHash: string,
    originUser: string
  ) {
    const hash = DigitalDocument.getDocHash(metadata, timestamp, blockHash, originUser);
    console.log(`[INFO] Retrieving file with hash: ${hash} from db`);
    const doc = await DocumentModel.findOne({ hash }) as DigitalDocument;

    if (!doc) {
      console.log('[ERROR] File not found');
      return null;
    }

    console.log(`[INFO] File with hash: ${hash} retrieved`)
    return doc;
  }

  public static async saveDocument(document: DigitalDocument): Promise<void> {
    const model = new DocumentModel(document);
    await model.save();
  }
}
