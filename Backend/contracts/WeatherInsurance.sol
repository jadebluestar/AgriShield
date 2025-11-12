// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract WeatherInsurance {
    struct Policy {
        uint256 id;
        address farmer;
        string location;
        uint256 coverageAmount;
        uint256 premiumPaid;
        bool active;
        uint256 createdAt;
    }

    // Each farmer can hold multiple policies identified by incremental IDs.
    mapping(address => uint256) private nextPolicyId; // starts at 0
    mapping(address => mapping(uint256 => Policy)) private policies; // farmer => policyId => Policy
    IERC721 public farmerNft;

    event PolicyCreated(address indexed farmer, uint256 indexed policyId, string location, uint256 coverage, uint256 premium);
    event PolicyCancelled(address indexed farmer, uint256 indexed policyId, uint256 refund);

    error InsufficientPremium();
    error PolicyNotActive();
    error PolicyDoesNotExist();

    constructor(address _farmerNft) {
        farmerNft = IERC721(_farmerNft);
    }

    function createPolicy(string memory location, uint256 coverageAmount) external payable {
        require(farmerNft.balanceOf(msg.sender) > 0, "Farmer NFT required");
        uint256 minPremium = (coverageAmount * 5) / 100; // 5% premium
        if (msg.value < minPremium) revert InsufficientPremium();

        uint256 pid = nextPolicyId[msg.sender];
        policies[msg.sender][pid] = Policy({
            id: pid,
            farmer: msg.sender,
            location: location,
            coverageAmount: coverageAmount,
            premiumPaid: msg.value,
            active: true,
            createdAt: block.timestamp
        });
        nextPolicyId[msg.sender] = pid + 1;

        emit PolicyCreated(msg.sender, pid, location, coverageAmount, msg.value);
    }

    function getPolicy(address farmer, uint256 policyId) external view returns (Policy memory) {
        Policy memory p = policies[farmer][policyId];
        if (p.farmer == address(0)) revert PolicyDoesNotExist();
        return p;
    }

    function getPolicies(address farmer) external view returns (Policy[] memory) {
        uint256 count = nextPolicyId[farmer];
        Policy[] memory list = new Policy[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = policies[farmer][i];
        }
        return list;
    }

    function cancelPolicy(uint256 policyId) external {
        Policy storage p = policies[msg.sender][policyId];
        if (p.farmer == address(0)) revert PolicyDoesNotExist();
        if (!p.active) revert PolicyNotActive();
        uint256 refund = p.premiumPaid;
        p.active = false;
        p.premiumPaid = 0;
        (bool ok,) = payable(msg.sender).call{value: refund}("");
        require(ok, "Refund failed");
        emit PolicyCancelled(msg.sender, policyId, refund);
    }
}
