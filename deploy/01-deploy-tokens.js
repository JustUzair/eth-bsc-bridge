const { network } = require("hardhat");
const hre = require("hardhat")


const polygonscan = "https://api-testnet.polygonscan.com/"
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(deployer);
    const chainId = network.config.chainId
    
    log("-----------------------------------------------------------------------------");
  
    if(chainId == 80001)
    {
      let transactionResponse
      const maticToken = await deploy("MaticToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
      });
      const maticTokenAddress = maticToken.address;
      const maticTokenAbi = maticToken.abi;
      const maticTokenContract = await (await hre.ethers.getContractFactory("MaticToken")).attach(maticTokenAddress)
      // transactionResponse = await maticTokenContract.mint(deployer,hre.ethers.BigNumber.from(hre.ethers.utils.parseEther("1000")));
      // await transactionResponse.wait()
      const BridgeMatic = await deploy("BridgeMatic", {
        from: deployer,
        args: [maticTokenAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
      });
      transactionResponse = await maticTokenContract.updateOwner(BridgeMatic.address);
      await transactionResponse.wait()
    }

    if(chainId === 11155111){
      let transactionResponse
      const ethToken = await deploy("EthToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
      });
      const ethTokenAddress = ethToken.address;
      const ethTokenAbi = ethToken.abi;
      const ethTokenContract = await (await hre.ethers.getContractFactory("EthToken")).attach(ethTokenAddress)
      transactionResponse = await ethTokenContract.mint(deployer,hre.ethers.BigNumber.from(hre.ethers.utils.parseEther("1000")));
      await transactionResponse.wait()
      const BridgeEth = await deploy("BridgeEth", {
        from: deployer,
        args: [ethTokenAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
      });
      transactionResponse = await ethTokenContract.updateOwner(BridgeEth.address);
      await transactionResponse.wait()
    }
    
    log("-----------------------------------------------------------------------------");
  };
  
  module.exports.tags = ["all", "deploy-tokens"];