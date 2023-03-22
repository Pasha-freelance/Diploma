import crypto from 'crypto';
import { IFile } from "../model/file.model";

const calculateHash = (name: string, mimetype: string, userId: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(name);
    hash.update(mimetype);
    return hash.digest('hex');
};

export const processFile = async (name: string, data: Buffer, mimetype: string): Promise<string> => {
    // Simulate the process of adding the file to a blockchain
    const blockHash = calculateHash(name, mimetype, '');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate the time it takes to add the block to the chain
    return blockHash;
};

export const verifyFile = async (name: string, blockHash: string, mimetype: string): Promise<boolean> => {
    // Simulate the process of verifying a file in a blockchain
    const calculatedHash = calculateHash(name, mimetype, '');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate the time it takes to verify the block in the chain
    return calculatedHash === blockHash;
};

interface IBlock {
    index: number;
    timestamp: number;
    data: any;
    previousHash: string;
    hash: string;
}

interface ITransaction {
    from: string;
    to: string;
    amount: number;
}

interface IDocument extends IFile {
    blockHash: string;
}

class Blockchain {
    private readonly chain: IBlock[];
    private readonly difficulty: number;
    private readonly reward: number;
    private pendingTransactions: ITransaction[];
    private lastBlock: IBlock;
    private documents: IDocument[];

    constructor(difficulty: number, reward: number) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.reward = reward;
        this.pendingTransactions = [];
        this.lastBlock = this.chain[0];
        this.documents = [];
    }

    private createGenesisBlock(): IBlock {
        const block: IBlock = {
            index: 0,
            timestamp: Date.now(),
            data: "Genesis Block",
            previousHash: "0",
            hash: "",
        };
        block.hash = this.calculateHash(block);
        return block;
    }

    private calculateHash(block: IBlock): string {
        const { index, timestamp, data, previousHash } = block;
        const hash = crypto
            .createHash("sha256")
            .update(index + timestamp + JSON.stringify(data) + previousHash)
            .digest("hex");
        return hash;
    }

    private mineBlock(): IBlock {
        const newBlock: IBlock = {
            index: this.lastBlock.index + 1,
            timestamp: Date.now(),
            data: this.pendingTransactions,
            previousHash: this.lastBlock.hash,
            hash: "",
        };

        newBlock.hash = this.calculateHash(newBlock);

        console.log("Mining new block...");
        while (!this.isBlockValid(newBlock)) {
            newBlock.timestamp = Date.now();
            newBlock.hash = this.calculateHash(newBlock);
        }

        console.log("Block mined successfully!");
        return newBlock;
    }

    private isBlockValid(block: IBlock): boolean {
        const hash = this.calculateHash(block);
        return (
            block.hash === hash &&
            hash.startsWith("0".repeat(this.difficulty)) &&
            block.previousHash === this.lastBlock.hash
        );
    }

    private getRewardTransaction(minerAddress: string): ITransaction {
        return {
            from: "0",
            to: minerAddress,
            amount: this.reward,
        };
    }

    private createTransaction(transaction: ITransaction): void {
        this.pendingTransactions.push(transaction);
    }

    private verifyTransaction(transaction: ITransaction): boolean {
        // ... transaction verification logic
    }

    public createDocument(document: IDocument): void {
        if (this.verifyDocument(document)) {
            console.log(`Document '${document.name}' verified successfully!`);
            const rewardTransaction = this.getRewardTransaction(document.blockHash);
            this.createTransaction(rewardTransaction);
            this.documents.push(document);
        } else {
            console.log(`Document '${document.name}' verification failed!`);
        }
    }

    private verifyDocument(document: IDocument): boolean {
        // ... document verification logic
    }

    public minePendingTransactions(minerAddress: string): void {
        const rewardTransaction = this.getRewardTransaction(minerAddress);
        this.createTransaction(rewardTransaction);

        const newBlock = this.mineBlock();
        this.chain.push(newBlock);
    }
}
