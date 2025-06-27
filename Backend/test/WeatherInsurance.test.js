const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeatherInsurance", function () {
    let weatherInsurance;
    let owner, farmer1, farmer2;
    
    // Mock Chainlink Functions router address (for testing)
    const MOCK_ROUTER = "0x1234567890123456789012345678901234567890";
    const SUBSCRIPTION_ID = 1;
    const DON_ID = "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000";
    
    beforeEach(async function () {
        [owner, farmer1, farmer2] = await ethers.getSigners();
        
        const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
        weatherInsurance = await WeatherInsurance.deploy(
            MOCK_ROUTER,
            SUBSCRIPTION_ID,
            DON_ID
        );
        await weatherInsurance.deployed();
    });
    
    it("Should create insurance policy", async function () {
        const coverageAmount = ethers.utils.parseEther("1");
        const premium = ethers.utils.parseEther("0.05"); // 5% of coverage
        
        await weatherInsurance.connect(farmer1).createPolicy(
            "New York",
            coverageAmount,
            { value: premium }
        );
        
        const policy = await weatherInsurance.getPolicy(farmer1.address);
        expect(policy.farmer).to.equal(farmer1.address);
        expect(policy.location).to.equal("New York");
        expect(policy.coverageAmount).to.equal(coverageAmount);
        expect(policy.active).to.be.true;
    });
    
    it("Should reject insufficient premium", async function () {
        const coverageAmount = ethers.utils.parseEther("1");
        const insufficientPremium = ethers.utils.parseEther("0.01"); // Less than 5%
        
        await expect(
            weatherInsurance.connect(farmer1).createPolicy(
                "New York", 
                coverageAmount,
                { value: insufficientPremium }
            )
        ).to.be.revertedWith("Insufficient premium");
    });
});