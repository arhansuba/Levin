import { ethers } from "ethers";
import SerperSearchContract from "../abis/SerperSearchContract.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const serperSearchAddress = process.env.SERPER_SEARCH_ADDRESS;
const serperSearchContract = new ethers.Contract(serperSearchAddress, SerperSearchContract.abi, wallet);

async function performSearch(query: string) {
    const tx = await serperSearchContract.performSearch(query);
    await tx.wait();
    console.log(`Search performed for query: ${query}`);
}

async function getSearchResult(query: string) {
    const result = await serperSearchContract.getSearchResult(query);
    console.log(`Search result: ${result[0]}, Timestamp - ${result[1]}`);
}

// Example usage
performSearch("example search query");
getSearchResult("example search query");
