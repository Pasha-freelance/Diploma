import { model, Schema } from "mongoose";

export interface IDocument extends Document {
  file: Buffer,
  hash: string;
}

const docSchema = new Schema({
  file: Buffer,
  hash: String,
});

export default model<IDocument>('Document', docSchema);
