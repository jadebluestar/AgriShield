const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy FarmerNFT
  const FarmerNFT = await hre.ethers.getContractFactory("FarmerNFT");
  const nft = await FarmerNFT.deploy();
  await nft.waitForDeployment();

  // Deploy simple WeatherInsurance (local, no Chainlink required)
  const WI = await hre.ethers.getContractFactory("WeatherInsurance");
  const wi = await WI.deploy(await nft.getAddress());
  await wi.waitForDeployment();

  const addresses = {
    farmerNFT: await nft.getAddress(),
    weatherInsurance: await wi.getAddress(),
  };

  console.log("FarmerNFT:", addresses.farmerNFT);
  console.log("WeatherInsurance:", addresses.weatherInsurance);

  // Write to frontend for local usage
  const outDir = path.resolve(__dirname, "..", "..", "Frontend", "src", "config");
  const file = path.join(outDir, "local-addresses.json");
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(addresses, null, 2));
    console.log("Wrote front-end addresses:", file);
  } catch (e) {
    console.warn("Failed to write front-end addresses:", e.message);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
