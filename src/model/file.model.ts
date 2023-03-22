import { model, Schema } from "mongoose";

export interface IFile extends Document {
    name: string;
    data: Buffer;
    mimetype: string;
}

const fileSchema = new Schema({
    name: String,
    data: Buffer,
    mimetype: String
});

export default model<IFile>('File', fileSchema);
