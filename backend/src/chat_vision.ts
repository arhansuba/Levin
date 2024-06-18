import { ethers } from "ethers";
import ChatGptVision from "../abis/ChatGptVision.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const chatGptVisionAddress = process.env.CHATGPT_VISION_ADDRESS;
const chatGptVisionContract = new ethers.Contract(chatGptVisionAddress, ChatGptVision.abi, wallet);

async function sendImage(imageData: string) {
    const tx = await chatGptVisionContract.sendImage(imageData);
    await tx.wait();
    console.log(`Image sent`);
}

async function getImage(imageId: number) {
    const image = await chatGptVisionContract.getImage(imageId);
    console.log(`Image received: ${image}`);
}

// Example usage
sendImage("base64_encoded_image_data");
getImage(0);
