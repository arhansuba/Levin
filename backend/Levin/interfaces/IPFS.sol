// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract IPFSStorageContract {
    IPFS private ipfs;

    struct File {
        string ipfsHash;
        string description;
        address uploader;
        uint256 timestamp;
    }

    mapping(uint256 => File) public files;
    uint256 public fileCount;

    event FileUploaded(uint256 fileId, string ipfsHash, string description, address uploader, uint256 timestamp);

    constructor(address _ipfsAddress) {
        ipfs = IPFS(_ipfsAddress);
    }

    function uploadFile(string memory data, string memory description) public {
        string memory ipfsHash = ipfs.add(data);
        files[fileCount] = File(ipfsHash, description, msg.sender, block.timestamp);
        emit FileUploaded(fileCount, ipfsHash, description, msg.sender, block.timestamp);
        fileCount++;
    }

    function getFile(uint256 fileId) public view returns (string memory, string memory, address, uint256) {
        File memory file = files[fileId];
        return (file.ipfsHash, file.description, file.uploader, file.timestamp);
    }
}
