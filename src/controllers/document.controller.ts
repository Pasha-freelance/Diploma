import { Request } from "express";
import { BlockChain } from "../services/blockchain/blockchain.class";
import { DigitalDocument } from "../services/documents/document.class";
import { Block } from "../services/blockchain/block.class";
import { DocumentDatabaseBridge } from "../services/documents/documentDBbridge.class";
import { AllowedUsersService } from "../services/allowedUsers/allowed-users.service";

export class DocumentsController {

  private readonly blockChain = new BlockChain();

  public async uploadDocument(req: Request, res: any, next: any) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file received' });
      }

      const block = new Block({ userId: req.query.userId + '' }, DigitalDocument.metadata(req.file));
      const isBlockSaved = await this.blockChain.addBlock(block);

      if (isBlockSaved) {
        const document = new DigitalDocument(
          req.file,
          block.timestamp,
          block.hash,
          block.originUser
        );
        await document.saveDocument();
      }
      else new Error();

      res.json({ message: 'File saved', uuid: block.uuid });

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async attachAllowedUsers(req: Request, res: any, next: any) {
    try {
      //NOTE doesn`t work with POSTMAN(works only with query params ???)
      const { uuid, allowedUsers } = req.body;

      if(!uuid) {
        return res.status(500).json({ message: 'No uuid for allowed users received' });
      }
      const block = await this.blockChain.getBlockByUUID(uuid);
      await AllowedUsersService.attach(uuid, block.address, allowedUsers);
      return res.json({ message: 'Allowed users added'});

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getAllowedToMeDocuments(req: Request, res: any, next: any) {
    try {
      const { userId } = req.query;

      if(!userId) {
        return res.status(500).json({ message: 'No userId for allowed users received' });
      }
      const blocks = await this.blockChain.getAllowedBlocks(userId as string);
      if (blocks) {

        res.json(blocks.map(block => (
          {
            originalName: block.docMetadata.originalname,
            uuid: block.uuid
          }
        )));

      } else {
        new Error('No blocks')
      }

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getUsersToAttach(req: Request, res: any, next: any) {
    try {
      const { email, profileId } = req.query;

      if (!profileId) {
        return res.status(400).json({ message: 'No profile id received' });
      }

      const users = await AllowedUsersService.getUsersToAttach(profileId as string, email as string);
      return res.json({ users });

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getFile(req: Request, res: any, next: any) {
    try {
      const { uuid, userId } = req.query;

      if (!uuid || !userId) {
        return res.status(400).json({ message: 'No required info received' });
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

  public async getAllDocuments(req: Request, res: any, next: any) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'No required info received' });
      }

      const blocks = await this.blockChain.getBlocksByOriginUser(userId as string);

      if (blocks) {

        res.json(blocks.map(block => (
          {
            originalName: block.docMetadata.originalname,
            uuid: block.uuid
          }
        )));

      } else {
        new Error('No blocks')
      }

    } catch (err) {
      console.error(err);
      next(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

}
