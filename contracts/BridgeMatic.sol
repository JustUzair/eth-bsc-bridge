//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./BaseBridge.sol";
contract BridgeMatic is BaseBridge {
  constructor(address token) BaseBridge(token) {}
}