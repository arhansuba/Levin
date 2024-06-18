import { ethers } from "ethers";
import BearlyAIGeneratorContract from "../abis/BearlyAIGeneratorContract.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const bearlyAIGeneratorAddress = process.env.BEARLY_AI_GENERATOR_ADDRESS;
const bearlyAIGeneratorContract = new ethers.Contract(bearlyAIGeneratorAddress, BearlyAIGeneratorContract.abi, wallet);

async function generateContent(prompt: string) {
    const tx = await bearlyAIGeneratorContract.generateContent(prompt);
    await tx.wait();
    console.log(`Content generated for prompt: ${prompt}`);
}

async function getContent(contentId: number) {
    const content = await bearlyAIGeneratorContract.getContent(contentId);
    console.log(`Generated content: Prompt - ${content[0]}, Content - ${content[1]}, Requester - ${content[2]}, Timestamp - ${content[3]}`);
}

// Example usage
generateContent("example prompt");
getContent(0);
