const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeatherInsurance", function () {
    let weatherInsurance;
    let farmerNFT;
    let owner, farmer1;

    beforeEach(async function () {
        [owner, farmer1] = await ethers.getSigners();

        const FarmerNFT = await ethers.getContractFactory("FarmerNFT");
        farmerNFT = await FarmerNFT.deploy();
        await farmerNFT.waitForDeployment();

        const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
        weatherInsurance = await WeatherInsurance.deploy(await farmerNFT.getAddress());
        await weatherInsurance.waitForDeployment();

        // Mint NFT to farmer1 to satisfy requirement
        await farmerNFT.connect(farmer1).mintNft("ipfs://token/1");
    });

    it("Should create insurance policy", async function () {
        const coverageAmount = ethers.parseEther("1");
        const premium = coverageAmount * 5n / 100n; // 5%

        await weatherInsurance.connect(farmer1).createPolicy("New York", coverageAmount, { value: premium });

        const policy = await weatherInsurance.getPolicy(farmer1.address);
        expect(policy.farmer).to.equal(farmer1.address);
        expect(policy.location).to.equal("New York");
        expect(policy.coverageAmount).to.equal(coverageAmount);
        expect(policy.active).to.equal(true);
    });

    it("Should reject insufficient premium", async function () {
        const coverageAmount = ethers.parseEther("1");
        const insufficientPremium = ethers.parseEther("0.01"); // Less than 5%

        await expect(
            weatherInsurance.connect(farmer1).createPolicy("New York", coverageAmount, { value: insufficientPremium })
        ).to.be.revertedWithCustomError(weatherInsurance, "InsufficientPremium");
    });

        it("Should cancel policy and refund premium", async function () {
            const coverageAmount = ethers.parseEther("1");
            const premium = coverageAmount * 5n / 100n; // 5%

            await weatherInsurance.connect(farmer1).createPolicy("LA", coverageAmount, { value: premium });

            const balBefore = await ethers.provider.getBalance(farmer1.address);
            const tx = await weatherInsurance.connect(farmer1).cancelPolicy();
            const receipt = await tx.wait();
            const gasSpent = receipt.gasUsed * receipt.gasPrice;

            const balAfter = await ethers.provider.getBalance(farmer1.address);
            // Allow for gas spent variance; ensure at least most of premium came back
            expect(balAfter + gasSpent).to.be.gte(balBefore + premium - 1n);

            const policy = await weatherInsurance.getPolicy(farmer1.address);
            expect(policy.active).to.equal(false);
        });
});