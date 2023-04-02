import { Request } from "express";
import { BlockChain } from "../services/blockchain/blockchain.class";
import { DigitalDocument } from "../services/documents/document.class";
import { Block } from "../services/blockchain/block.class";
import { DocumentDatabaseBridge } from "../services/documents/documentDBbridge.class";

export class DocumentsController {

  private readonly blockChain = new BlockChain();

  public async uploadDocument(req: Request, res: any, next: any) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file received' });
      }

      const document = new DigitalDocument(req.file);
      const block = new Block({ userId: req.body.userId, uuid: req.body.uuid }, document.metadata);

      await this.blockChain.addBlock(block);
      await document.addDocument();

      res.json({ message: 'File saved' });
    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getFile(req: Request, res: any, next: any) {
    try {
      const { uuid, userId } = req.query;

      if (!uuid) {
        return res.status(400).json({ message: 'No info for block' });
      }

      const block = await this.blockChain.getBlockByUUID(uuid as string);
      const document = await DocumentDatabaseBridge.retrieveDocumentFromDatabase(block.docMetadata);

      res.contentType(block.docMetadata.mimetype);
      res.send(document.file);

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

}
