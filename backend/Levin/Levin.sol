// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;              
import "backend/contracts/interfaces/IOracle.sol";
import "./interfaces/IPFS.sol";
import "./interfaces/SerperApi.sol";
import "./interfaces/BearlyApi.sol";
import "backend/contracts/ChatOracle.sol"; 

contract Levin {
    struct CodingKnowledge {
        string[] examples;
        string[] documentation;
        string[] bestPractices;
    }

    struct ChatRun {
        address owner;
        string[] messages;
        uint messagesCount;
    }

    mapping(uint => ChatRun) public chatRuns;
    uint private chatRunsCount;

    address private owner;
    address public oracleAddress;
    address public ipfsAddress;
    address public serperAPIAddress;
    address public bearlyAPIAddress;

    event OracleAddressUpdated(address indexed newOracleAddress);
    event IPFSAddressUpdated(address indexed newIPFSAddress);
    event SerperAPIAddressUpdated(address indexed newSerperAPIAddress);
    event BearlyAPIAddressUpdated(address indexed newBearlyAPIAddress);
    event ChatCreated(address indexed owner, uint indexed chatId);

    IOracle.LevinRequest private config;
    CodingKnowledge private knowledgeBase;

    constructor(
        address initialOracleAddress,
        address initialIPFSAddress,
        address initialSerperAPIAddress,
        address initialBearlyAPIAddress
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        ipfsAddress = initialIPFSAddress;
        serperAPIAddress = initialSerperAPIAddress;
        bearlyAPIAddress = initialBearlyAPIAddress;
        chatRunsCount = 0;

        config = IOracle.LevinRequest({
            model: "levin-8x7b-32768",
            frequencyPenalty: 21,
            logitBias: "",
            maxTokens: 1000,
            presencePenalty: 21,
            responseFormat: "{\"type\":\"text\"}",
            seed: 0,
            stop: "",
            temperature: 10,
            topP: 101,
            user: ""
        });

        // Initialize the knowledge base
        knowledgeBase.examples.push("Solidity smart contract examples");
        knowledgeBase.documentation.push("Solidity documentation");
        knowledgeBase.bestPractices.push("Smart contract security best practices");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setIPFSAddress(address newIPFSAddress) public onlyOwner {
        ipfsAddress = newIPFSAddress;
        emit IPFSAddressUpdated(newIPFSAddress);
    }

    function setSerperAPIAddress(address newSerperAPIAddress) public onlyOwner {
        serperAPIAddress = newSerperAPIAddress;
        emit SerperAPIAddressUpdated(newSerperAPIAddress);
    }

    function setBearlyAPIAddress(address newBearlyAPIAddress) public onlyOwner {
        bearlyAPIAddress = newBearlyAPIAddress;
        emit BearlyAPIAddressUpdated(newBearlyAPIAddress);
    }

    function startChat(string memory message) public returns (uint) {
        ChatRun storage run = chatRuns[chatRunsCount];
        run.owner = msg.sender;
        run.messages.push(message);
        run.messagesCount = 1;

        uint currentId = chatRunsCount;
        chatRunsCount++;

        IOracle(oracleAddress).createLlmCall(currentId, config);
        emit ChatCreated(msg.sender, currentId);

        return currentId;
    }

    function onOracleLlmResponse(
        uint chatId,
        IOracle.LevinResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        ChatRun storage run = chatRuns[chatId];
        require(run.messages.length > 0, "No message to respond to");

        if (!compareStrings(errorMessage, "")) {
            run.messages.push(errorMessage);
            run.messagesCount++;
        } else {
            run.messages.push(response.content);
            run.messagesCount++;
        }
    }

    function analyzeCode(uint chatId) public {
        ChatRun storage run = chatRuns[chatId];
        require(run.messages.length > 0, "No message to analyze");

        string memory code = run.messages[run.messages.length - 1];

        // Example of calling Groq LLM
        GroqRequest memory groqConfig = GroqRequest({
            model: "llama3-8b-8192",
            frequencyPenalty: 0,
            logitBias: "",
            maxTokens: 1000,
            presencePenalty: 0,
            responseFormat: "{\"type\":\"text\"}",
            seed: 0,
            stop: "",
            temperature: 10,
            topP: 100,
            user: ""
        });

        IOracle(oracleAddress).createGroqLlmCall(chatId, groqConfig);
    }

    function deployContract(uint chatId, string memory code) public {
        ChatRun storage run = chatRuns[chatId];
        require(run.owner == msg.sender, "Only chat owner can deploy contracts");
        require(run.messages.length > 0, "No code to deploy");

        // Pseudo code for deploying a contract
        // Example:
        // compileAndDeploy(code);
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    // Function to call OpenAI LLM
    function createOpenAiLlmCall(uint promptCallbackId, ChatOracle.OpenAiRequest memory config) public returns (uint) {
        return IOracle(oracleAddress).createOpenAiLlmCall(promptCallbackId, config);
    }

    // Function to handle response from OpenAI LLM
    function onOracleOpenAiLlmResponse(uint callbackId, ChatOracle.OpenAiResponse memory response, string memory errorMessage) public onlyOracle {
        // Handle response from OpenAI LLM
        // Example: process the response or log an error
    }

    // Function to query knowledge base
    function createKnowledgeBaseQuery(uint kbQueryCallbackId, string memory cid, string memory query, uint32 num_documents) public returns (uint) {
        return IOracle(oracleAddress).createKnowledgeBaseQuery(kbQueryCallbackId, cid, query, num_documents);
    }

    // Function to handle response from knowledge base query
    function onOracleKnowledgeBaseQueryResponse(uint kbQueryCallbackId, string[] memory documents, string memory errorMessage) public onlyOracle {
        // Handle response from knowledge base query
        // Example: process retrieved documents or log an error
    }
}
