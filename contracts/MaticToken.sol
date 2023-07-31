//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "./BaseToken.sol";
contract MaticToken is BaseToken{
    constructor() BaseToken("Polygon Matic","MATIC"){}
}