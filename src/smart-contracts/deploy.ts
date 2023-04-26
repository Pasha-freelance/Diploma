import {
  BaseContract,
  Block,
  Contract,
  ContractFactory, ContractTransactionReceipt,
  JsonRpcProvider,
  Wallet
} from 'ethers';
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
  let contractAddress: string;
  let response: ITransactionDto;
  console.log('[INFO] Contract is deploying...');

  try {
    contract = await contractFactory.deploy();
    contractAddress = await contract.getAddress();
    const receipt = await contract.deploymentTransaction()?.wait(1) as ContractTransactionReceipt;
    await evaluateContractMethod(contractAddress, 'init', block);
    const deployedBlock = await receipt.getBlock();

    response = {
      hash: deployedBlock.hash as string,
      prevHash: deployedBlock.parentHash,
      timestamp: deployedBlock.timestamp,
      nonce: deployedBlock.nonce,
      address: contractAddress
    };


    console.log(`[INFO] Contract is deployed successfully!`);
  } catch (e) {
    console.error(e);
    throw new Error('[ERROR] Error during contract deploying');
  }

  return response;
}

export async function evaluateContractMethod(address: string, method: string, props?: any): Promise<any> {
  console.log(`[INFO] Evaluating contract method: ${method}`);
  const contract = new Contract(address, JSON.parse(abi), contractFactory.runner);
  const fn = contract.getFunction(method);
  const response = await (props ? fn(props) : fn());
  console.log(`[INFO] Contract method: ${method} evaluated successfully!`);
  return response;
}

export async function getGenesisBlock(): Promise<ITransactionDto> {
  const block = await provider.getBlock(0) as Block;
  return {
    hash: block.hash as string,
    prevHash: block.parentHash,
    timestamp: block.timestamp,
    nonce: block.nonce,
    address: ''
  };
}
