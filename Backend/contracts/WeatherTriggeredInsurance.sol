// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

// Replace forge-std imports with standard imports
// import {console} from "forge-std/console.sol"; // Remove this - use hardhat/console.sol if needed
import "hardhat/console.sol"; // Add this if you need console logging
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Replace forge-std IERC721
// Remove DevOpsTools import - implement alternative if needed
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
    }

    function getTimePeriodBasedOnFundingProvided(uint256 _amountFunded) public pure returns (uint256) {
        uint256 baseTime = 365 days;
        return (baseTime * 0.001 ether) / _amountFunded;
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
            wholeDayPassed = (currentTime - s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]]) > 150;
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
            uint256 amount = 0.005 ether;
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

    function sendRequest(uint64 subscriptionId, string[] memory args) public onlyOwner returns (bytes32 requestId) {
        require(bytes(s_source).length > 0, "Source code not set");
        require(subscriptionId > 0, "Invalid subscription ID");
        require(args.length >= 2, "Missing args"); // Since you need location + API key
        require(bytes(args[0]).length > 0, "Location empty");
        require(bytes(args[1]).length > 0, "API key empty");
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, i_gasLimit, i_donID);

        return s_lastRequestId;
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
}