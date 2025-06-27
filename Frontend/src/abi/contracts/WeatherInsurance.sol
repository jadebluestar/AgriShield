// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FarmerNFT.sol";

contract WeatherInsurance is FunctionsClient, Ownable {
    FarmerNFT public farmerNFT;
    bytes32 public latestRequestId;
    uint256 public lastRainfall;
    uint256 public threshold = 10; // mm

    struct Policy {
        uint256 coverage;
        bool active;
        bool paid;
    }

    mapping(address => Policy) public policies;
    event PolicyCreated(address farmer, uint256 coverage);
    event RainfallUpdated(uint256 mm);
    event ClaimPaid(address farmer, uint256 amount);

    constructor(address router, uint64 subscriptionId, address farmerNFTAddr) FunctionsClient(router) {
        farmerNFT = FarmerNFT(farmerNFTAddr);
        setSubscriptionId(subscriptionId);
    }

    function createPolicy(uint256 coverageAmount) external payable {
        require(farmerNFT.isFarmer(msg.sender), "Not a farmer");
        uint256 premium = (coverageAmount * 100) / 10000;
        require(msg.value >= premium, "Pay premium");

        policies[msg.sender] = Policy(coverageAmount, true, false);
        emit PolicyCreated(msg.sender, coverageAmount);
    }

    function requestRainData(string memory location) external onlyOwner returns (bytes32) {
        Functions.Request memory req = Functions.Request({
            codeLocation: Functions.Location.Inline,
            secretsLocation: Functions.Location.Inline,
            language: Functions.CodeLanguage.JavaScript,
            source: getSource()
        });
        req.addArgs([location]);
        latestRequestId = sendRequest(req.encodeCBOR(), subscriptionId, 200000);
        return latestRequestId;
    }

    function fulfillRequest(bytes32 requestId, bytes memory data, bytes memory err) internal override {
        lastRainfall = abi.decode(data, (uint256));
        emit RainfallUpdated(lastRainfall);
        if (lastRainfall < threshold) {
            for(uint i=0;i<1;i++){ // demo: loop through known farmers, or track in array
                address farmer = owner(); // replace demo logic
                if(policies[farmer].active){
                    payable(farmer).transfer(policies[farmer].coverage);
                    policies[farmer].paid = true;
                    policies[farmer].active = false;
                    emit ClaimPaid(farmer, policies[farmer].coverage);
                }
            }
        }
    }

    function getSource() internal pure returns (string memory) {
        return
        "const loc= args[0];"
        +"const res= await Functions.makeHttpRequest({url:`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${secrets.OPEN_WEATHER_API_KEY}&units=metric`});"
        +"const mm = res.data.rain ? (res.data.rain['1h'] || 0) : 0;"
        +"return Functions.encodeUint256(mm);";
    }

    receive() external payable {}
}
