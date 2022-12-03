// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

interface IDeployer {
    function addToUserLaunchpad(address _user, address _launchpad) external;
    function updateStats(uint256 _invested, uint256 _contributors, address _paymenToken) external;
}

contract pumpItLaunchpad is Ownable, Pausable {   
    uint256 public softCap;
    uint256 public hardCap;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public totalDeposits;
    uint256 public contributors;

    string public projectName;
    string public projectSymbol;

    address public contractAdmin;
    address public tokenAccepted;

    mapping (address => uint256) public depositedAmount;

    IDeployer deployer;
    IERC20 paymentToken;

    event userDeposit(uint256 amount, address user);
    event remaingWithdraw(address operator, uint256 amount, uint256 timeStamp);

    constructor (uint256 [] memory _caps, uint256 [] memory _times, address _contractAdmin, address _tokenAccepted, string memory _projectName,string memory _projectSymbol) {       
        softCap = (_caps[0] * 10**18) / 10000;
        hardCap = (_caps[1] * 10**18) / 10000;      
       
        startTime = _times[0];
        endTime = _times[1];

        contractAdmin = _contractAdmin; 
        tokenAccepted = _tokenAccepted;

        if(tokenAccepted != address(0)){
            paymentToken = IERC20(tokenAccepted);
        }
        
        projectName= _projectName;
        projectSymbol= _projectSymbol;

        deployer = IDeployer(msg.sender);  
    }

    modifier restricted(){
        require(msg.sender == owner() || msg.sender == contractAdmin, "Caller not allowed");
        _;
    }

    function buy (uint256 deposit) external payable {
        require(startTime < block.timestamp, "Sale is not open yet");
        require(endTime > block.timestamp, "Sale is already closed");
        require(deposit + totalDeposits <= hardCap, "Hardcap reached");

        if(tokenAccepted != address(0)){
            paymentToken.transferFrom(msg.sender, address(this), deposit);
        } else {
            require(deposit >= msg.value, "not enough tokens sended");
        }      

        if(depositedAmount[msg.sender] == 0){
            contributors++;
            deployer.addToUserLaunchpad(msg.sender, address(this));
        }

        depositedAmount[msg.sender] = depositedAmount[msg.sender] + deposit;
        totalDeposits += deposit;

        emit userDeposit(deposit, msg.sender);
    }

    function sendTokens(address recipient, uint256 _amount) internal {
        paymentToken.transfer(recipient, _amount);
    }


    function withdrawRemainig () external restricted {
        require(endTime < block.timestamp || totalDeposits == hardCap, "Sale not ended yet");
        require(totalDeposits > softCap, "Sale didn't reach soft cap");       

        uint256 balance;

        if(tokenAccepted != address(0)){
           balance = address(this).balance;
           payable(msg.sender).transfer(balance);
        } else {
           balance = paymentToken.balanceOf(address(this));
           sendTokens(msg.sender, balance);
        }        

        deployer.updateStats(balance, contributors, tokenAccepted);

        emit remaingWithdraw(msg.sender, balance, block.timestamp);
    }

    function claimRefund () external {
        require(endTime < block.timestamp, "Sale didn't end");
        require(totalDeposits < softCap, "soft cap is reached");   

        uint256 balance = depositedAmount[msg.sender];
        require(balance > 0, "No deposits");

        depositedAmount[msg.sender] = 0;

        if(tokenAccepted != address(0)){
           payable(msg.sender).transfer(balance);
        } else {
           sendTokens(msg.sender, balance);
        }    
    }

    function getContractNumbers() external view returns (uint256 [] memory data,string memory _name, string memory _symbol, address _admin, address _payment){
        data = new uint256[](6);
        data[0] = softCap;
        data[1] = hardCap;
        data[2] = startTime;
        data[3] = endTime;
        data[4] = totalDeposits;
        data[5] = contributors;
       
        _name = projectName;
        _symbol = projectSymbol;
        _admin = contractAdmin;
        _payment = tokenAccepted;
    }
}
