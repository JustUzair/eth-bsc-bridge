require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
// require("solidity-coverage");
// require("hardhat-gas-reporter");
// require("hardhat-contract-sizer");
require("dotenv").config();
const private_key = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    matic_testnet: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [private_key],
      chainId: 80001,
    },
    eth_testnet: {
      url: `https://rpc.notadegen.com/sepolia`,
      accounts: [private_key],
      chainId: 11155111,
    },
  },

};
