//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract BaseBridge{
    address admin;
    uint nonce;
    mapping(uint => bool) processedNonces;
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

    constructor (address _token){
        admin = msg.sender;
        token = IToken(_token);
    }

    function burn(address to, uint amount) external{
        token.burn(msg.sender,amount);
        emit Transfer(
            msg.sender, 
            to, 
            amount, 
            nonce, 
            block.timestamp, 
            Action.Burn
        );
        nonce ++;
    }


    function mint(address to, uint amount, uint externalChainNonce) external {
        require(msg.sender == admin, "Not Admin");
        require(processedNonces[externalChainNonce] == false, "already processed!!");
        processedNonces[externalChainNonce] = true; 
        token.mint(to,amount);
        emit Transfer(
            msg.sender, 
            to, 
            amount, 
            externalChainNonce, 
            block.timestamp, 
            Action.Mint
        );
    }


}