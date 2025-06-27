// src/config/contracts.js

// Replace these with your actual deployed contract addresses
export const CARBON_CREDIT_ADDRESS = "0x168A477F2798945477C17cbF99484610810a6a25"; // Your CarbonCredit contract address
export const FARMER_NFT_ADDRESS = "0x700Ea8b631928D8803A4ff430A51D1400D17377c"; // Your FarmerNFT contract address
export const WEATHER_INSURANCE_ADDRESS = "0x4819ce544C57184dAABce53bd202a647C417D87C"; // Your WeatherTriggeredInsurance contract address

// Carbon Credit Contract ABI
export const CARBON_CREDIT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "baseCarbonPerHectare", "type": "uint256"},
      {"internalType": "address", "name": "mostRecentDeployed", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CarbonCredit__FarmerNFTNotMinted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CarbonCredit__InvalidCropType",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CarbonCredit__InvalidPracticeType",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "farmerAddress", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "numberOfTokens", "type": "uint256"}
    ],
    "name": "MintedBasedOnSavedCarbon",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "area", "type": "uint256"},
      {"internalType": "string", "name": "cropType", "type": "string"},
      {"internalType": "string", "name": "practiceType", "type": "string"}
    ],
    "name": "mintBasedOnSavedCarbon",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Farmer NFT Contract ABI
export const FARMER_NFT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "string", "name": "tokenUri", "type": "string"}],
    "name": "mintNft",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Weather Insurance Contract ABI (partial - add more functions as needed)
export const WEATHER_INSURANCE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "location", "type": "string"}],
    "name": "getInsurance",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getInsuranceUsers",
    "outputs": [{"internalType": "address payable[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getFarmerLocation",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];