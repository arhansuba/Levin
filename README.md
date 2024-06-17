# Levin

Welcome to Levin, a platform harnessing Galadriel for decentralized AI and smart contracts.

Levin empowers developers with tools to deploy and manage smart contracts integrated with Galadriel's decentralized AI infrastructure. It facilitates autonomous software engineering by combining AI capabilities with blockchain technology.


## Overview

Levin integrates Galadriel's decentralized AI capabilities to enhance autonomous software engineering. It facilitates the development, deployment, and management of smart contracts with a focus on decentralized AI integration.

## Features

- **Decentralized AI Integration:** Utilizes Galadriel for on-chain AI to empower autonomous decision-making processes.
  
- **Smart Contract Development:** Facilitates the creation and deployment of smart contracts directly integrated with Galadriel's decentralized platform.

## Getting Started

To start using Levin with Galadriel, follow these steps:

1. **Install Dependencies:**

   Ensure you have Docker installed on your system.

2. **Clone the Levin Repository:**

   ```bash
   git clone https://github.com/arhansuba/levin.git
   cd levin
3. **Run Levin with Galadriel:**

## Getting Started with Galadriel

To deploy and interact with AI applications on Galadriel's devnet within Levin, follow these steps:

### Prerequisites

- Create a Galadriel devnet account and obtain some devnet tokens.
- Ensure `node` and `npm` are installed on your machine.

### Deploying a Contract on Galadriel Devnet
 -Go to backend folder then contracts folder we already initialized Galadriel Contracts repo for usage 
 Setup Environment Variables:

###Use the template.env file to create a .env file and modify it:

cp template.env .env 

Set the following variables in .env:

PRIVATE_KEY_GALADRIEL: Private key of the account for deploying contracts.
ORACLE_ADDRESS: Current devnet oracle address provided by Galadriel team (e.g., 0x4168668812C94a3167FCd41D12014c5498D74d7e).

Install Dependencies:

Install dependencies using npm:
 npm install

Deploy Contract to Galadriel Devnet:

Deploy the quickstart contract using the following script:

npm run deployQuickstart

Note the deployed contract address outputted by the script. Export it in your terminal for future contract interactions:

export QUICKSTART_CONTRACT_ADDRESS=0x...

Calling Your Contract
Execute the Contract Call Script:

Ensure you've deployed the quickstart contract and stored its address. Run the script to interact with the deployed contract:


npm run callQuickstart
Follow the interactive prompts to provide input (e.g., DALL-E prompt for generating an image). The script will call the contract with the input, and once ready, it will display the output on the console.

Ensure the QUICKSTART_CONTRACT_ADDRESS environment variable is correctly set before executing this step.

Contributing
Contributions to Levin are welcome. Please follow our Contribution Guidelines.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Support
For support or inquiries related to Levin and its integration with Galadriel, please contact us at subasiarhan3@gmail.com

