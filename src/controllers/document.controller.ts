import { Request } from "express";
import * as service from '../services/document.service';

export const uploadDocument = async (req: Request, res: any, next: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file received' });
        }

        const { originalname, buffer, mimetype } = req.file;

        // Process the file with blockchain technology
        const blockHash = await service.processFileWithBlockchain(originalname, buffer, mimetype);

        // Save the file to the database
        await service.saveFile(originalname, buffer, blockHash, mimetype);

        res.status(201).json({ message: 'File saved' });
    } catch (err) {
        console.error(err);
        next(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFile = async (req: Request, res: any, next: any) => {
    try {
        const file = await service.getFileByBlockHash(req.query.blockHash as string);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Verify the file with blockchain technology
        const isVerified = await service.verifyFileWithBlockchain(file.name, file.blockHash, file.mimetype);

        if (!isVerified) {
            return res.status(401).json({ message: 'File not verified' });
        }

        res.contentType(file.mimetype);
        res.send(file.data);
    } catch (err: unknown) {
        console.error(err);
        next(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
