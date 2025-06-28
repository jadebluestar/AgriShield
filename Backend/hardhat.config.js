require("@nomicfoundation/hardhat-toolbox"); // Includes ethers, chai, etc.
require("@chainlink/functions-toolkit");     // For Chainlink Functions
require("@nomiclabs/hardhat-ethers");
// Optional: Load secrets safely using .env (highly recommended)
require("dotenv").config();

module.exports = {
  solidity: "0.8.28", // Use the highest version among your contracts
};
