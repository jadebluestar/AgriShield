const hre = require("hardhat");
require("dotenv").config();

// Usage (PowerShell):
// $env:CONTRACT="0x..."; $env:ACCUWEATHER_KEY="<key>"; npx hardhat run scripts/configureWeatherFunctions.js --network fuji

async function main() {
  const contractAddress = process.env.CONTRACT || process.argv.find(a => a.startsWith("--contract="))?.split("=")[1];
  if (!contractAddress) throw new Error("Set CONTRACT env or pass --contract=0x...");

  const accukey = process.env.ACCUWEATHER_KEY || process.env.WEATHER_API_KEY;
  if (!accukey) throw new Error("Set ACCUWEATHER_KEY in .env");

  const sub = process.env.CLF_SUBSCRIPTION_ID ? BigInt(process.env.CLF_SUBSCRIPTION_ID) : undefined;

  const WI = await hre.ethers.getContractFactory("WeatherTriggeredInsurance");
  const wi = WI.attach(contractAddress);

  // Fetch the recommended source from the contract helper
  const source = await wi.getRecommendedAccuWeatherSource();

  const tx1 = await wi.setApiKey(accukey);
  await tx1.wait();
  console.log("setApiKey done");

  const tx2 = await wi.setSource(source);
  await tx2.wait();
  console.log("setSource done");

  if (sub !== undefined) {
    const tx3 = await wi.setSubscription(Number(sub));
    await tx3.wait();
    console.log("setSubscription:", sub.toString());
  }

  console.log("WeatherTriggeredInsurance configured at:", contractAddress);
}

main().catch((e) => { console.error(e); process.exit(1); });
