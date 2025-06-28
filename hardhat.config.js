require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./Backend/contracts",
    tests: "./Backend/test",
    artifacts: "./Backend/artifacts",
    cache: "./Backend/cache",
  },
  defaultNetwork: "hardhat",
};
