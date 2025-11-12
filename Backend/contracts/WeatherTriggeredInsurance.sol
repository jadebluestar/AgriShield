// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

// Removed foundry-only imports to make this contract compile in Hardhat
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {AutomationCompatibleInterface} from
    "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_3_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract WeatherTriggeredInsurance is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface {
    using FunctionsRequest for FunctionsRequest.Request;

    error WeatherTriggeredInsurance__FarmerNFTNotMinted();
    error WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance();
    error UnexpectedRequestID(bytes32);
    error WeatherTriggeredInsurance__TransferFailed();

    address payable[] private s_InsuranceUsers;
    uint256[] private s_startInsuranceTime;
    uint256 public s_counter;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint64 public s_subscriptionId;

    string private s_apiKey;
    string public s_source;
    string public s_lastRainfallString;
    bytes32 private immutable i_donID;
    uint32 private immutable i_gasLimit;

    mapping(address => uint256) private s_adressToInsurancePeriod;
    mapping(address => string) private s_addressToFarmerLocation;
    mapping(address => uint256) private s_addressToLastRainCheck;
    mapping(bytes32 => address) private s_requestIdToUser;
    mapping(address => uint256[7]) private s_addressToRainData;
    mapping(address => uint256) private s_addressToTimeAPIIsCalled;
    mapping(address => uint256) private s_addressToPremiumPaid;
    mapping(address => uint256) private s_addressToStartTime;

    constructor(
        address router,
        bytes32 donId,
        uint32 gasLimit,
        uint64 subscriptionId,
        string memory source,
        string memory apiKey,
        address mostRecentDeployed
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        s_subscriptionId = subscriptionId;
        s_counter = 0;
        i_donID = donId;
        i_gasLimit = gasLimit;
        s_source = source;
        s_apiKey = apiKey;
        farmerNft = IERC721(mostRecentDeployed);
    }

    IERC721 public farmerNft;

    event InsuranceEnter(address indexed user);
    event TimePeriodAssigned();
    event InsuranceTimeStarted(uint256 indexed timeStarted);
    event Response(bytes32 indexed requestId, string character, bytes response, bytes err);
    event OneDayCheckUpdated(address indexed user);
    event LocationAssigned(address indexed user);
    event DroughtPayout(address indexed user, uint256 amount);
    event AddressToAPICalledUpdated(uint256 indexed valueOfNumberofCalls);
    event InsuranceCancelled(address indexed user, uint256 refundAmount);

    function getInsurance(string memory location) public payable {
        //Follow CEI
        if (farmerNft.balanceOf(msg.sender) == 0) {
            revert WeatherTriggeredInsurance__FarmerNFTNotMinted();
        }
        if (msg.value < 0.001 ether) {
            revert WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance();
        }
        s_startInsuranceTime.push(block.timestamp);
        emit InsuranceTimeStarted(block.timestamp);
        s_InsuranceUsers.push(payable(msg.sender));
        emit InsuranceEnter(msg.sender);
        s_adressToInsurancePeriod[msg.sender] = getTimePeriodBasedOnFundingProvided(msg.value);
        emit TimePeriodAssigned();
        s_addressToFarmerLocation[msg.sender] = location;
        emit LocationAssigned(msg.sender);
        s_addressToPremiumPaid[msg.sender] = msg.value;
        s_addressToStartTime[msg.sender] = block.timestamp;
    }

    function getTimePeriodBasedOnFundingProvided(uint256 _amountFunded) public pure returns (uint256) {
        uint256 baseTime = 365 days;
        return (baseTime * _amountFunded) / 0.001 ether;
    }

    function checkUpkeep(bytes calldata /*checkData*/ )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (s_InsuranceUsers.length == 0) return (false, "");
        uint256 checkIndex = getCheckIndex();

        uint256 currentTime = block.timestamp;
        uint256 timePassed = currentTime - s_startInsuranceTime[checkIndex];
        bool wholeDayPassed;
        bool validInsurance = timePassed < s_adressToInsurancePeriod[s_InsuranceUsers[checkIndex]];
        if (s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]] == 0) {
            wholeDayPassed = true;
        } else {
            wholeDayPassed = (currentTime - s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]]) > 24 hours;
        }

        upkeepNeeded = (validInsurance && wholeDayPassed);

        if (upkeepNeeded) {
            performData = abi.encode(s_InsuranceUsers[checkIndex]);
        } else {
            performData = "";
        }
        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData) external override {
        address user = abi.decode(performData, (address));

        string[] memory args = new string[](2);
        args[0] = s_addressToFarmerLocation[user];
        args[1] = s_apiKey;

        bytes32 requestId = sendRequest(s_subscriptionId, args);
        s_requestIdToUser[requestId] = user;
        s_addressToLastRainCheck[user] = block.timestamp;
        emit OneDayCheckUpdated(user);
        s_counter = (s_counter + 1) % s_InsuranceUsers.length;
    }

    function getCheckIndex() internal view returns (uint256) {
        return (s_counter) % s_InsuranceUsers.length;
    }

    function _fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        // Update the contract's state variables with the response and any errors
        require(response.length > 0, "Empty API response");
        uint256 rainfall = abi.decode(response, (uint256));

        address user = s_requestIdToUser[requestId];
        bool drought = isDrought(user, rainfall);
        if (drought) {
            uint256 amount = (address(this).balance / s_InsuranceUsers.length);
            (bool success,) = user.call{value: amount}("");
            if (!success) {
                revert WeatherTriggeredInsurance__TransferFailed();
            }

            emit DroughtPayout(user, amount);

            //rainfall logic to trigger
            s_lastResponse = response;
            s_lastRainfallString = string(response);
            s_lastError = err;

            // Emit an event to log the response
            emit Response(requestId, s_lastRainfallString, s_lastResponse, s_lastError);
        }
    }

    // Removed onlyOwner so Chainlink Automation can trigger via performUpkeep
    function sendRequest(uint64 subscriptionId, string[] memory args) public returns (bytes32 requestId) {
        // require(bytes(s_source).length > 0, "Source code not set");
        // require(subscriptionId > 0, "Invalid subscription ID");
        // require(args.length >= 2, "Missing args"); // Since you need location + API key
        // require(bytes(args[0]).length > 0, "Location empty");
        // require(bytes(args[1]).length > 0, "API key empty");
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, i_gasLimit, i_donID);

        return s_lastRequestId;
    }

    // Allow owner to update AccuWeather JS source and API key
    function setSource(string memory newSource) external onlyOwner {
        s_source = newSource;
    }

    function setApiKey(string memory newKey) external onlyOwner {
        s_apiKey = newKey;
    }

    function setSubscription(uint64 newSub) external onlyOwner {
        s_subscriptionId = newSub;
    }

    // Helper: recommended default AccuWeather source
    // args[0] = city name; args[1] = apiKey
    function getRecommendedAccuWeatherSource() external pure returns (string memory) {
        return string(
            abi.encodePacked(
                "const city = args[0];\n",
                "const apiKey = args[1];\n",
                "// 1) get location key\n",
                "const locUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}`;\n",
                "const locRes = await fetch(locUrl);\n",
                "if (!locRes.ok) throw new Error('Location lookup failed');\n",
                "const locData = await locRes.json();\n",
                "if (!Array.isArray(locData) || locData.length === 0) throw new Error('City not found');\n",
                "const key = locData[0].Key;\n",
                "// 2) get current conditions with precip summary\n",
                "const wxUrl = `https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${apiKey}&details=true`;\n",
                "const wxRes = await fetch(wxUrl);\n",
                "if (!wxRes.ok) throw new Error('Weather fetch failed');\n",
                "const wxData = await wxRes.json();\n",
                "const mm = Math.floor((wxData?.[0]?.PrecipitationSummary?.Past24Hours?.Metric?.Value) ?? 0);\n",
                "return Functions.encodeUint256(mm);\n"
            )
        );
    }

    // User can cancel and receive a pro-rated refund of the premium based on remaining period
    function cancelInsurance() external {
        uint256 period = s_adressToInsurancePeriod[msg.sender];
        require(period > 0, "No active policy");
        uint256 start = s_addressToStartTime[msg.sender];
        uint256 paid = s_addressToPremiumPaid[msg.sender];
        uint256 elapsed = block.timestamp > start ? (block.timestamp - start) : 0;
        uint256 refund = 0;
        if (elapsed < period) {
            refund = (paid * (period - elapsed)) / period;
        }
        // Mark as inactive
        s_adressToInsurancePeriod[msg.sender] = 0;
        s_addressToPremiumPaid[msg.sender] = 0;
        // best-effort refund
        if (refund > 0 && address(this).balance >= refund) {
            (bool ok,) = payable(msg.sender).call{value: refund}("");
            if (!ok) revert WeatherTriggeredInsurance__TransferFailed();
        }
        emit InsuranceCancelled(msg.sender, refund);
    }

    function isDrought(address user, uint256 rainfall) public returns (bool) {
        s_addressToRainData[user][s_addressToTimeAPIIsCalled[user] % 7] = rainfall;
        s_addressToTimeAPIIsCalled[user]++;
        emit AddressToAPICalledUpdated(s_addressToTimeAPIIsCalled[user]);
        if (s_addressToTimeAPIIsCalled[user] < 7) return false;
        for (uint256 i = 0; i < 7; i++) {
            if (s_addressToRainData[user][i] > 500) {
                return false;
            }
        }
        return true;
    }

    function getStartInsuranceTime() external view returns (uint256[] memory) {
        return s_startInsuranceTime;
    }

    function getInsuranceUsers() external view returns (address payable[] memory) {
        return s_InsuranceUsers;
    }

    function getAddressToRainData(address user) external view returns (uint256[7] memory) {
        return s_addressToRainData[user];
    }

    function getAddressToTimesAPICalled(address user) external view returns (uint256) {
        return s_addressToTimeAPIIsCalled[user];
    }

    function getRequestIdToUser(bytes32 user) external view returns (address) {
        return s_requestIdToUser[user];
    }

    function getAddressToLastRainCheck(address user) external view returns (uint256) {
        return s_addressToLastRainCheck[user];
    }

    function getFarmerLocation(address user) external view returns (string memory) {
        return s_addressToFarmerLocation[user];
    }

    function getInsurancePeriod(address user) external view returns (uint256) {
        return s_adressToInsurancePeriod[user];
    }

    function getPremiumPaid(address user) external view returns (uint256) {
        return s_addressToPremiumPaid[user];
    }

    function getStartTime(address user) external view returns (uint256) {
        return s_addressToStartTime[user];
    }
}