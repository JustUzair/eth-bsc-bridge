//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./BaseBridge.sol";
contract BridgeEth is BaseBridge {
  constructor(address token) BaseBridge(token) {}
}