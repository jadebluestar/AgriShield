const hre = require("hardhat");

async function main() {
  const router = "0x<ChainlinkRouterAddress>";
  const subId = 123; // your subscription ID
  const FarmerNFT = await hre.ethers.getContractFactory("FarmerNFT");
  const nft = await FarmerNFT.deploy();
  await nft.deployed();

  const WI = await hre.ethers.getContractFactory("WeatherInsurance");
  const wi = await WI.deploy(router, subId, nft.address);
  await wi.deployed();

  console.log("Deployed at:", wi.address);
}

main().catch(console.error);
