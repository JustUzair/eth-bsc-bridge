//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
interface IToken{
    function mint(address to, uint amount) external;
    function burn(address owner,uint amount) external;
}