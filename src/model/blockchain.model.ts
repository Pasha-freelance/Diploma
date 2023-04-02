import { model, Schema } from "mongoose";

export interface IDocumentMetadata {
  originalname: string;
  mimetype: string;
}

export interface IBlock {
  hash: string;
  prevHash: string;
  originUser: string;
  docMetadata: IDocumentMetadata;
  uuid: string;
  timestamp: string;
}

const blockSchema = new Schema({
  hash: String,
  prevHash: String,
  originUser: String,
  docMetadata: Object,
  uuid: String,
  timestamp: String,
});

export default model<IBlock>('BlockChain', blockSchema);
