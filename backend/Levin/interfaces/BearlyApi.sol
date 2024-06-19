// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract BearlyAIGeneratorContract {
    BearlyAPI private bearlyAPI;

    struct AIGeneratedContent {
        string prompt;
        string content;
        address requester;
        uint256 timestamp;
    }

    mapping(uint256 => AIGeneratedContent) public generatedContents;
    uint256 public contentCount;

    event ContentGenerated(uint256 contentId, string prompt, string content, address requester, uint256 timestamp);

    constructor(address _bearlyAPIAddress) {
        bearlyAPI = BearlyAPI(_bearlyAPIAddress);
    }

    function generateContent(string memory prompt) public {
        string memory content = bearlyAPI.generate(prompt);
        generatedContents[contentCount] = AIGeneratedContent(prompt, content, msg.sender, block.timestamp);
        emit ContentGenerated(contentCount, prompt, content, msg.sender, block.timestamp);
        contentCount++;
    }

    function getContent(uint256 contentId) public view returns (string memory, string memory, address, uint256) {
        AIGeneratedContent memory content = generatedContents[contentId];
        return (content.prompt, content.content, content.requester, content.timestamp);
    }
}
