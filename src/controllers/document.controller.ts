import { Request } from "express";
import * as service from '../services/document.service';

export const uploadDocument = async (req: Request, res: any, next: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file received' });
        }

        await service.saveFile(req.file.originalname, req.file.buffer, req.file.mimetype);

        res.status(201).json({ message: 'File saved' });
    } catch (err) {
        console.error(err);
        next(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFile = async (req: Request<{ blockHash: string }>, res: any, next: any) => {
    try {
        const file = await service.getFileByBlockHash(req.params.blockHash);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.contentType(file.mimetype);
        res.send(file.data);
    } catch (err: unknown) {
        console.error(err);
        next(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
