import { ethers } from "ethers";
import Agent from "../abis/Agent.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const agentAddress = process.env.AGENT_ADDRESS;
const agentContract = new ethers.Contract(agentAddress, Agent.abi, wallet);

async function performAction(action: string, params: any[]) {
    const tx = await agentContract.performAction(action, ...params);
    await tx.wait();
    console.log(`Action performed: ${action}`);
}

async function getActionResult(actionId: number) {
    const result = await agentContract.getActionResult(actionId);
    console.log(`Action result: ${result}`);
}

// Example usage
performAction("exampleAction", ["param1", "param2"]);
getActionResult(0);
