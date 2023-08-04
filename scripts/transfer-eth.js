const { network } = require("hardhat");
const hre = require("hardhat")
const ethToken= require("../deployments/eth_testnet/EthToken.json")
const ethBridge = require("../deployments/eth_testnet/BridgeEth.json")


async function main () {
    
    console.log("-----------------------------------------------------------------------------");
    const recipient = "0xA72e562f24515C060F36A2DA07e0442899D39d2c"

      const ethTokenAddress = ethToken.address;
      const ethTokenAbi = ethToken.abi;
      const ethBridgeContract = await (await hre.ethers.getContractFactory("BridgeEth")).attach(ethBridge.address)
        const transactionResponse = await ethBridgeContract.burn(recipient,hre.ethers.BigNumber.from(hre.ethers.utils.parseEther("10")));
        // console.log(transactionResponse);
        await transactionResponse.wait()
        // console.log("10 eth burn successful");
      
    
    
    console.log("-----------------------------------------------------------------------------");
  };


main();

// const bigNum = hre.ethers.BigNumber.from("0x034")
// console.log(bigNum);