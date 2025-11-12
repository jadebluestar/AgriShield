require("@nomicfoundation/hardhat-toolbox"); // Includes ethers v6 plugin & chai
// require("@chainlink/functions-toolkit"); // Optional: only needed for local Functions sim
// Removed @nomiclabs/hardhat-ethers (ethers v5) to avoid conflict with ethers v6
// Optional: Load secrets safely using .env (highly recommended)
require("dotenv").config();

module.exports = {
  solidity: "0.8.28", // Use the highest version among your contracts
  networks: {
    hardhat: {},
    fuji: {
      url: process.env.AVAX_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
