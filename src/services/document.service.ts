import File, { IFile } from '../model/file.model';

export const saveFile = async (name: string, data: Buffer, mimetype: string): Promise<void> => {
    const file = new File({
        name: name,
        data: data,
        mimetype: mimetype
    });
    await file.save();
}

export const getFileByBlockHash = async (blockHash: string): Promise<IFile | null> => {
    const file = await File.find({name: 'pdf.pdf'});
    return file[0];
};

