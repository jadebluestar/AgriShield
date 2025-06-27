const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgriChain System", function () {
    let farmerNFT, weatherInsurance;
    let owner, farmer1, farmer2;
    
    beforeEach(async function () {
        [owner, farmer1, farmer2] = await ethers.getSigners();
        
        // Deploy FarmerNFT
        const FarmerNFT = await ethers.getContractFactory("FarmerNFT");
        farmerNFT = await FarmerNFT.deploy();
        
        // Deploy WeatherInsurance
        const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
        weatherInsurance = await WeatherInsurance.deploy(farmerNFT.address);
    });
    
    it("Should register farmer and create insurance policy", async function () {
        // Register farmer
        await farmerNFT.registerFarmer(
            farmer1.address,
            "John Doe",
            "California",
            "Wheat"
        );
        
        expect(await farmerNFT.isFarmer(farmer1.address)).to.be.true;
        
        // Create insurance policy
        const coverageAmount = ethers.utils.parseEther("1");
        const premium = ethers.utils.parseEther("0.01");
        
        await weatherInsurance.connect(farmer1).createPolicy(coverageAmount, {
            value: premium
        });
        
        const policy = await weatherInsurance.getPolicy(farmer1.address);
        expect(policy.active).to.be.true;
    });
});