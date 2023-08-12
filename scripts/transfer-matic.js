const { network } = require("hardhat");
const hre = require("hardhat")
const maticToken= require("../deployments/matic_testnet/MaticToken.json")
const maticBridge = require("../deployments/matic_testnet/BridgeMatic.json")


async function main () {
    
    console.log("-----------------------------------------------------------------------------");
    const recipient = "0xA72e562f24515C060F36A2DA07e0442899D39d2c"

      const maticTokenAddress = maticToken.address;
      const maticTokenAbi = maticToken.abi;
      const maticBridgeContract = await (await hre.ethers.getContractFactory("BridgeEth")).attach(maticBridge.address)
        const transactionResponse = await maticBridgeContract.burn(recipient,hre.ethers.BigNumber.from(hre.ethers.utils.parseEther("1000")));
        // console.log(transactionResponse);
        await transactionResponse.wait()
        // console.log("10 eth burn successful");
      
    
    
    console.log("-----------------------------------------------------------------------------");
  };


main();

// const bigNum = hre.ethers.BigNumber.from("0x034")
// console.log(bigNum);