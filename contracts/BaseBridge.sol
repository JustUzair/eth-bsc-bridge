//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract BaseBridge{
    address admin;
    uint nonce;
    mapping(uint => bool) processesNonces;
    IToken public token;

    enum Action{
        Burn,
        Mint
    }

    event Transfer(
        address from,
        address to,
        uint amount,
        uint nonce,
        uint date,
        Action indexed action
    );


    
}