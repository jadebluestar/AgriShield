// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC721} from "forge-std/interfaces/IERC721.sol";

contract CarbonCredit is ERC20 {
    error CarbonCredit__FarmerNFTNotMinted();
    error CarbonCredit__InvalidCropType();
    error CarbonCredit__InvalidPracticeType();

    uint256 private immutable i_baseCarbonPerHectare;
    address private immutable i_mostRecentDeployed;
    IERC721 public farmerNFT;

    event MintedBasedOnSavedCarbon(address indexed farmerAddress, uint256 indexed numberOfTokens);

    constructor(uint256 baseCarbonPerHectare, address mostRecentDeployed) ERC20("CarbonCreditToken", "CCT") {
        i_baseCarbonPerHectare = baseCarbonPerHectare;
        farmerNFT = IERC721(mostRecentDeployed);
    }

    function mintBasedOnSavedCarbon(uint256 area, string memory cropType, string memory practiceType)
        public
        returns (bool)
    {
        if (farmerNFT.balanceOf(msg.sender) == 0) {
            revert CarbonCredit__FarmerNFTNotMinted();
        }
        require(area > 0, "Invalid Area provided");
        if (keccak256(abi.encodePacked(cropType)) == keccak256(abi.encodePacked(""))) {
            revert CarbonCredit__InvalidCropType();
        }
        if (keccak256(abi.encodePacked(practiceType)) == keccak256(abi.encodePacked(""))) {
            revert CarbonCredit__InvalidPracticeType();
        }

        uint256 carbonSaved =
            (area) * (i_baseCarbonPerHectare) * (cropMultiplier(cropType)) * practiceMultiplier(practiceType);
        uint256 tokensToMint = (carbonSaved * 1 ether) / 10000;
        _mint(msg.sender, tokensToMint);
        emit MintedBasedOnSavedCarbon(msg.sender, tokensToMint);
        return true;
    }

    function cropMultiplier(string memory crop) internal pure returns (uint256) {
        if (compareStrings(crop, "wheat")) return 100;
        if (compareStrings(crop, "rice")) return 80;
        if (compareStrings(crop, "pulses")) return 120;
        if (compareStrings(crop, "maize")) return 110;
        return 100;
    }

    function compareStrings(string memory str1, string memory str2) internal pure returns (bool) {
        if (keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2))) return true;
        else return false;
    }

    function practiceMultiplier(string memory practiceType) internal pure returns (uint256) {
        if (compareStrings(practiceType, "organic")) return 130;
        if (compareStrings(practiceType, "no-till")) return 120;
        if (compareStrings(practiceType, "biochar")) return 150;
        if (compareStrings(practiceType, "cover")) return 140;
        return 100;
    }
}
