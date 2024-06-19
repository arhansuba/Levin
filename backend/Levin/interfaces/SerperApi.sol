// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract SerperSearchContract {
    SerperAPI private serperAPI;

    struct SearchResult {
        string query;
        string result;
        uint256 timestamp;
    }

    mapping(string => SearchResult) public searchResults;

    event SearchPerformed(string query, string result, uint256 timestamp);

    constructor(address _serperAPIAddress) {
        serperAPI = SerperAPI(_serperAPIAddress);
    }

    function performSearch(string memory query) public {
        SearchResult memory cachedResult = searchResults[query];
        if (cachedResult.timestamp != 0) {
            emit SearchPerformed(query, cachedResult.result, cachedResult.timestamp);
            return;
        }

        string memory result = serperAPI.search(query);
        searchResults[query] = SearchResult(query, result, block.timestamp);
        emit SearchPerformed(query, result, block.timestamp);
    }

    function getSearchResult(string memory query) public view returns (string memory, uint256) {
        SearchResult memory result = searchResults[query];
        return (result.result, result.timestamp);
    }
}
