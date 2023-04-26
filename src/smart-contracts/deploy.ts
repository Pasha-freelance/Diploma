import { BaseContract, Block, ContractFactory, ContractTransactionReceipt, JsonRpcProvider, Wallet } from 'ethers';
import fs from 'fs';
import { IContractDto, ITransactionDto } from "../interfaces/transaction-dto.interface";

require('dotenv').config();

const provider = new JsonRpcProvider(process.env.RPC_SERVER);
const wallet = new Wallet(process.env.SMART_CONTRACT_PRIVATE_KEY as string, provider);
const abi = fs.readFileSync(process.env.ABI_PATH as string, 'utf8');
const bin = fs.readFileSync(process.env.BIN_PATH as string, 'utf8');
const contractFactory = new ContractFactory(abi, bin, wallet);

export async function deployContract(block: IContractDto): Promise<ITransactionDto> {

  let contract: BaseContract;
  let response: ITransactionDto;
  console.log('[INFO] Contract is deploying...');

  try {
    contract = await contractFactory.deploy(block.uuid, block);
    const n = await contract.getFunction('setData');
    await n(block.uuid, block)

    const receipt = await contract.deploymentTransaction()?.wait(1) as ContractTransactionReceipt;
    const deployedBlock = await receipt.getBlock();

    response = {
      hash: deployedBlock.hash as string,
      prevHash: deployedBlock.parentHash,
      timestamp: deployedBlock.timestamp,
      nonce: deployedBlock.nonce,
    };

    const a = await contract.getFunction('getData');

    const b = await a('d02871db-f982-4908-89c8-66dce48c3d2b')
    console.log(b)

    console.log(`[INFO] Contract with hash ${deployedBlock.hash} is deployed successfully!`);
  } catch (e) {
    console.error(e);
    throw new Error('[ERROR] Error during contract deploying');
  }

  return response;
}

export async function getGenesisBlock(): Promise<ITransactionDto> {
  const block = await provider.getBlock(0) as Block;
  return {
    hash: block.hash as string,
    prevHash: block.parentHash,
    timestamp: block.timestamp,
    nonce: block.nonce,
  };
}
