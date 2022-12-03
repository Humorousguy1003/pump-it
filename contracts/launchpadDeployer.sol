// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./pumpItLaunchpad.sol";

contract pumpIDeployer is Ownable {
    uint256 public launchpadCount;
    uint256 public deployCost = 0.01 ether;
    uint256 public totalParticipants;

    mapping(uint256 => address) public launchpadById;
    mapping(address => uint256) public launchpadIdByAddress;
    mapping(address => uint256) public totalInvested;
    mapping(address => bool) private isLaunchpad;
    mapping(address => address[]) public userLaunchpadInvested;
    mapping(address => mapping(address => bool)) isLaunchpadAdded;

    event launchpadDeployed(address newTokenAddress, address deployer);

    function createLaunchpad(
       uint256 [] memory _caps, uint256 [] memory _times, address _tokenAccepted, string memory _projectName,string memory _projectSymbol) public payable {
        require(msg.value >= deployCost, "Not enough payment to deploy");

        pumpItLaunchpad newLaunchpad = new pumpItLaunchpad(          
            _caps,
            _times,
            msg.sender,
            _tokenAccepted,
            _projectName,
            _projectSymbol
        );
        
        newLaunchpad.transferOwnership(owner());     

        payable(owner()).transfer(msg.value);

        launchpadById[launchpadCount] = address(newLaunchpad);
        launchpadIdByAddress[address(newLaunchpad)] = launchpadCount;
        launchpadCount++;

        isLaunchpad[address(newLaunchpad)] = true;

        emit launchpadDeployed(address(newLaunchpad), msg.sender);
    }

    function getDeployedLaunchpads(uint256 startIndex, uint256 endIndex)
        public
        view
        returns (address[] memory)
    {
        if (endIndex >= launchpadCount) {
            endIndex = launchpadCount - 1;
        }

        uint256 arrayLength = endIndex - startIndex + 1;
        uint256 currentIndex;
        address[] memory launchpadAddress = new address[](arrayLength);

        for (uint256 i = startIndex; i <= endIndex; i++) {
            launchpadAddress[currentIndex] = launchpadById[startIndex + i];
            currentIndex++;
        }

        return launchpadAddress;
    }

    function setPrice(uint256 _price) external onlyOwner {
        deployCost = _price;
    }

    function addToUserLaunchpad(address _user, address _launchpad) external {
        require(isLaunchpad[msg.sender], "Only launchpads can add");

        if (!isLaunchpadAdded[_user][_launchpad]) {
            userLaunchpadInvested[_user].push(_launchpad);
            isLaunchpadAdded[_user][_launchpad] = true;
        }
    }

    function updateStats(uint256 _invested, uint256 _contributors, address paymentToken) external {
        require(isLaunchpad[msg.sender], "Only launchpads can add");

        totalInvested[paymentToken] += _invested;
        totalParticipants += _contributors;
    }

    function getUserContributions(address _user)
        external
        view
        returns (uint256[] memory ids, uint256[] memory contributions)
    {
        uint256 count = userLaunchpadInvested[_user].length;
        ids = new uint256[](count);
        contributions = new uint256[](count);

        for (uint256 i; i < count; i++) {
            address launchpadaddress = userLaunchpadInvested[_user][i];
            ids[i] = launchpadIdByAddress[launchpadaddress];
            contributions[i] = pumpItLaunchpad(launchpadaddress).depositedAmount(
                _user
            );
        }
    }

    function getStats()
        external
        view
        returns (
            uint256 _projects,
            uint256 _participants
        )
    {
        _projects = launchpadCount;
        _participants = totalParticipants;
    }
}
