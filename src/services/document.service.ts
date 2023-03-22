import File, { IFile } from '../model/file.model';
import { processFile, verifyFile } from "./blockchain.service";

export const saveFile = async (name: string, buffer: Buffer, blockHash: string, mimetype: string): Promise<void> => {
    const file = new File({
        name: name,
        data: buffer,
        blockHash: blockHash,
        mimetype: mimetype
    });
    await file.save();
}

export const getFileByBlockHash = async (blockHash: string): Promise<IFile | null> => {
    return File.findOne({ blockHash: blockHash });
};

export const processFileWithBlockchain = async (name: string, data: Buffer, mimetype: string): Promise<string> => {
    // Process the file with blockchain technology and return the block hash
    return processFile(name, data, mimetype);
};

export const verifyFileWithBlockchain = async (name: string, blockHash: string, mimetype: string): Promise<boolean> => {
    // Verify the file with blockchain technology and return a boolean indicating whether the file is verified or not
    return verifyFile(name, blockHash, mimetype);
};

