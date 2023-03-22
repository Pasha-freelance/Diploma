import { model, Schema } from "mongoose";

export interface IFile extends Document {
    name: string;
    data: Buffer,
    blockHash: string;
    mimetype: string;
}

const fileSchema = new Schema({
    name: String,
    data: Buffer,
    blockHash: String,
    mimetype: String
});

export default model<IFile>('File', fileSchema);
