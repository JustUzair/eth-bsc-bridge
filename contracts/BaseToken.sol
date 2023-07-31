//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaseToken is ERC20{
    address admin;
    constructor(string memory name,string memory symbol) ERC20(name,symbol){
        admin = msg.sender;
    }
    modifier onlyAdmin {
        require(msg.sender == admin, "Not Owner");
        _;
    }
    function updateOwner(address newOwner) external  onlyAdmin{
        admin = newOwner;
    }

    function mint(address to, uint amount) external onlyAdmin{
        _mint(to,amount);
    }

    function burn(address senderOwner, uint amount) external onlyAdmin{
        _burn(senderOwner, amount);
    }
}
