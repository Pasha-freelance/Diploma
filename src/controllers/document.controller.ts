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

      const block = new Block({ userId: req.body.userId, uuid: req.body.uuid }, DigitalDocument.metadata(req.file));
      const document = new DigitalDocument(
        req.file,
        block.timestamp,
        block.hash,
        block.originUser
      );

      await this.blockChain.addBlock(block);
      await document.saveDocument();

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
      const document = await DocumentDatabaseBridge.retrieveDocumentFromDatabase(
        block.docMetadata,
        block.timestamp,
        block.hash,
        block.originUser
      );

      if (document) {
        res.contentType(block.docMetadata.mimetype);
        res.send(document.file);
      } else {
        new Error('[ERROR] FILE is not retrieved !');
      }

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

}
