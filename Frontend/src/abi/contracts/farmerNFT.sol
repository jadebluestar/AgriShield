// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmerNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct Farmer {
        string name;
        string location;
        string cropType;
        uint256 registrationDate;
        bool isVerified;
    }
    
    mapping(uint256 => Farmer) public farmers;
    mapping(address => uint256) public farmerToTokenId;
    
    event FarmerRegistered(address indexed farmer, uint256 tokenId, string name);
    
    constructor() ERC721("AgriChain Farmer", "FARMER") {}
    
    function registerFarmer(
        address to,
        string memory name,
        string memory location,
        string memory cropType
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        farmers[tokenId] = Farmer({
            name: name,
            location: location,
            cropType: cropType,
            registrationDate: block.timestamp,
            isVerified: false
        });
        
        farmerToTokenId[to] = tokenId;
        
        emit FarmerRegistered(to, tokenId, name);
        return tokenId;
    }
    
    function getFarmer(uint256 tokenId) public view returns (Farmer memory) {
        return farmers[tokenId];
    }
    
    function isFarmer(address addr) public view returns (bool) {
        return balanceOf(addr) > 0;
    }
}
