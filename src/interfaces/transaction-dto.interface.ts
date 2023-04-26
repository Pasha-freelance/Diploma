import { IDocumentMetadata } from "../model/blockchain.model";

export interface ITransactionDto {
  hash: string;
  prevHash: string;
  timestamp: number;
  nonce: string;
  address: string;
}

export interface IContractDto {
  originUser: string;
  uuid: string;
  docMetadata: IDocumentMetadata
}
