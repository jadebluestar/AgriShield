const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgriChain System", function () {
    let farmerNFT, weatherInsurance;
    let owner, farmer1;

    beforeEach(async function () {
        [owner, farmer1] = await ethers.getSigners();

        const FarmerNFT = await ethers.getContractFactory("FarmerNFT");
        farmerNFT = await FarmerNFT.deploy();
        await farmerNFT.waitForDeployment();

        const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
        weatherInsurance = await WeatherInsurance.deploy(await farmerNFT.getAddress());
        await weatherInsurance.waitForDeployment();
    });

    it("Should mint farmer NFT and create insurance policy", async function () {
        // Mint Farmer NFT
        await farmerNFT.connect(farmer1).mintNft("ipfs://farmer/1");

        // Create insurance policy
        const coverageAmount = ethers.parseEther("1");
        const premium = coverageAmount * 5n / 100n; // 5%

        await weatherInsurance.connect(farmer1).createPolicy("California", coverageAmount, { value: premium });

        const policy = await weatherInsurance.getPolicy(farmer1.address);
        expect(policy.active).to.equal(true);
        expect(policy.location).to.equal("California");
    });
});