import { ethers } from "ethers";
import IPFSStorageContract from "../abis/IPFSStorageContract.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const ipfsStorageAddress = process.env.IPFS_STORAGE_ADDRESS;
const ipfsStorageContract = new ethers.Contract(ipfsStorageAddress, IPFSStorageContract.abi, wallet);

async function uploadFile(data: string, description: string) {
    const tx = await ipfsStorageContract.uploadFile(data, description);
    await tx.wait();
    console.log(`File uploaded with description: ${description}`);
}

async function getFile(fileId: number) {
    const file = await ipfsStorageContract.getFile(fileId);
    console.log(`File retrieved: IPFS Hash - ${file[0]}, Description - ${file[1]}, Uploader - ${file[2]}, Timestamp - ${file[3]}`);
}

// Example usage
uploadFile("data_to_store_on_ipfs", "Sample file description");
getFile(0);
