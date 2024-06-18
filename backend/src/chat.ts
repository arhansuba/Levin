import { ethers } from "ethers";
import ChatGpt from "../abis/ChatGpt.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const chatGptAddress = process.env.CHATGPT_ADDRESS;
const chatGptContract = new ethers.Contract(chatGptAddress, ChatGpt.abi, wallet);

async function sendMessage(message: string) {
    const tx = await chatGptContract.sendMessage(message);
    await tx.wait();
    console.log(`Message sent: ${message}`);
}

async function getMessage(messageId: number) {
    const message = await chatGptContract.getMessage(messageId);
    console.log(`Message received: ${message}`);
}

// Example usage
sendMessage("Hello, ChatGPT!");
getMessage(0);
