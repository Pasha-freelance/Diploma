import DocumentModel from "../../model/document.model";
import { IDocumentMetadata } from "../../model/blockchain.model";
import { DocumentBridge } from "../blockDocumentBridge.class";
import { DigitalDocument } from "./document.class";

export class DocumentDatabaseBridge {

  public static async retrieveDocumentFromDatabase(metadata: IDocumentMetadata) {
    const hash = DocumentBridge.getDocHash(metadata);
    console.log(`[INFO] Retrieving file with hash: ${hash} from db`);
    const doc = await DocumentModel.findOne({ hash }) as DigitalDocument;
    console.log(`[INFO] File with hash: ${hash} retrieved`)
    return doc;
  }

  public static async saveDocument(document: DigitalDocument): Promise<void> {
    const model = new DocumentModel(document);
    await model.save();
  }
}
