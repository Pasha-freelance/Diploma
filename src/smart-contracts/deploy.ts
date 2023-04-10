import { IBlock } from "../model/blockchain.model";

const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

export default async function main(block: IBlock) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_SERVER);
  const wallet = new ethers.Wallet(
    process.env.SMART_CONTRACT_PRIVATE_KEY,
    provider
  );
  const abi = fs.readFileSync(process.env.ABI_PATH, 'utf8');
  const bin = fs.readFileSync(process.env.BIN_PATH , 'utf8');
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);

  console.log('[INFO] Contract is deploying...');
  const contract = await contractFactory.deploy(block.uuid, block);
  await contract.waitForDeployment();
  console.log('[INFO] Contract is deployed successfully!');

  return await contract.getData(block.uuid);
}
