import { Contract, ethers, Wallet } from "ethers";
import ABI from "./abis/Levin.json";
import * as readline from 'readline';

require("dotenv").config()

interface Message {
  role: string,
  content: string,
}

async function main() {
  const rpcUrl = process.env.RPC_URL
  if (!rpcUrl) throw Error("Missing RPC_URL in .env")
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")
  const contractAddress = process.env.LEVIN_CONTRACT_ADDRESS
  if (!contractAddress) throw Error("Missing LEVIN_CONTRACT_ADDRESS in .env")

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(privateKey, provider)
  const contract = new Contract(contractAddress,ABI, wallet)

  // The query you want to start the agent with
  const query = await getUserInput("Enter the initial chat message: ")

  // Call the startChat function
  const transactionResponse = await contract.startChat(query);
  const receipt = await transactionResponse.wait()
  console.log(`Task sent, tx hash: ${receipt.transactionHash}`)
  console.log(`Chat started with initial message: "${query}"`)

  // Get the chat run ID from transaction receipt logs
  let chatId = getChatRunId(receipt, contract);
  console.log(`Created chat run ID: ${chatId}`)
  if (!chatId && chatId !== 0) {
    return
  }

  let allMessages: Message[] = []
  // Run the chat loop: read messages and send messages
  var exitNextLoop = false;
  while (true) {
    const newMessages: Message[] = await getNewMessages(contract, chatId, allMessages.length);
    if (newMessages) {
      for (let message of newMessages) {
        let roleDisplay = message.role === 'assistant' ? 'THOUGHT' : 'STEP';
        let color = message.role === 'assistant' ? '\x1b[36m' : '\x1b[33m'; // Cyan for thought, yellow for step
        console.log(`${color}${roleDisplay}\x1b[0m: ${message.content}`);
        allMessages.push(message)
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (exitNextLoop){
      console.log(`Chat run ID ${chatId} finished!`);
      break;
    }
    if (await contract.isRunFinished(chatId)) {
      exitNextLoop = true;
    }
  }

}

async function getUserInput(query: string): Promise<string | undefined> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer)
      })
    })
  }

  try {
    const input = await question(query)
    rl.close()
    return input
  } catch (err) {
    console.error('Error getting user input:', err)
    rl.close()
  }
}


function getChatRunId(receipt: ethers.TransactionReceipt, contract: Contract) {
  let chatRunID
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log)
      if (parsedLog && parsedLog.name === "ChatCreated") {
        // Second event argument
        chatRunID = ethers.toNumber(parsedLog.args[1])
      }
    } catch (error) {
      // This log might not have been from your contract, or it might be an anonymous log
      console.log("Could not parse log:", log)
    }
  }
  return chatRunID;
}

async function getNewMessages(
  contract: Contract,
  chatRunID: number,
  currentMessagesCount: number
): Promise<Message[]> {
  const messages = await contract.getMessageHistoryContents(chatRunID)
  const roles = await contract.getMessageHistoryRoles(chatRunID)

  const newMessages: Message[] = []
  messages.forEach((message: any, i: number) => {
    if (i >= currentMessagesCount) {
      newMessages.push({
        role: roles[i],
        content: messages[i]
      })
    }
  })
  return newMessages;
}

main()
  .then(() => console.log("Done"))
  .catch((error) => console.error("Error: ", error));
