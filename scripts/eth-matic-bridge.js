const { ethers, BigNumber } = require("ethers");
const ethBridge = require("../deployments/eth_testnet/BridgeEth.json");
const maticBridge = require("../deployments/matic_testnet/BridgeMatic.json");
const ethToken = require("../deployments/eth_testnet/EthToken.json");
const maticToken = require("../deployments/matic_testnet/MaticToken.json");
const { network } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();

// console.log("ETH Bridge address : "+ethBridgeAbi.address);
async function main() {
  console.log("running");
  const recipient = "0xA72e562f24515C060F36A2DA07e0442899D39d2c";

  const ethTokenAddress = ethToken.address;
  const maticTokenAddress = maticToken.address;

  const ethProvider = new ethers.providers.WebSocketProvider(
    "wss://sepolia.infura.io/ws/v3/b75048e5cd284cf286c112b4373b4ccf"
  );
  const ethSignerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethProvider);

  const ethBridgeContract = new ethers.Contract(
    ethBridge.address,
    ethBridge.abi,
    ethSignerWallet
  );

  const polygonProvider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );
  const maticSignerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, polygonProvider);
  const signer = polygonProvider.getSigner();

  const maticBridgeContract = new ethers.Contract(
    maticBridge.address,
    maticBridge.abi,
    maticSignerWallet
  );

  // console.log("maticBridgeContract : ",maticBridgeContract);
  // console.log("signer : ",signer);
  /*
    
    event Transfer(
        address from,
        address to,
        uint amount,
        uint nonce,
        uint date,
        Action indexed action
    );
    
    */
  ethBridgeContract.on(
    "Transfer",
    async (from, to, amount, nonce, date, action, event) => {
      let info = {
        from,
        to,
        amount,
        amountReadable: ethers.utils.formatEther(
          ethers.BigNumber.from(amount.toString())
        ),
        nonce,
        nonceReadable: ethers.utils.formatEther(nonce.toString()),
        date,
        dateTimestampReadable: ethers.utils.formatEther(date.toString()),
        action,
      };

      console.log(info);

      if (info.action == 0) {
        try {
          console.log(
            "-----------------------------------------------------------------------------"
          );
          const maticToBridge = (info.amountReadable * 1800) / 6; // 1800$ is ethereum price and 6$ is matic price fixed

          let tx = await maticBridgeContract.mint(recipient,
              ethers.utils
                .parseUnits(maticToBridge.toString(), "ether")
                .toString(),
              info.nonce
            );
          let r = await tx.wait();
          // console.log(r);

          console.log(
            "-----------------------------------------------------------------------------"
          );
          console.log("Bridge success!!! :)");
        } catch (err) {
          console.log(err);
          console.log("Bridge failed!!! :(");
        }
      }
    }
  );



  maticBridgeContract.on(
    "Transfer",
    async (from, to, amount, nonce, date, action, event) => {
      console.log("matic burn");
      let info = {
        from,
        to,
        amount,
        amountReadable: ethers.utils.formatEther(
          ethers.BigNumber.from(amount.toString())
        ),
        nonce,
        nonceReadable: ethers.utils.formatEther(nonce.toString()),
        date,
        dateTimestampReadable: ethers.utils.formatEther(date.toString()),
        action,
      };

      console.log(info);

      if (info.action == 0) {
        try {
          console.log(
            "-----------------------------------------------------------------------------"
          );
          const ethToBridge = (info.amountReadable * 6) / 1800; // 1800$ is ethereum price and 6$ is matic price fixed

          let tx = await ethBridgeContract.mint(recipient,
              ethers.utils
                .parseUnits(ethToBridge.toString(), "ether")
                .toString(),
              info.nonce
            );
          let r = await tx.wait();
          // console.log(r);

          console.log(
            "-----------------------------------------------------------------------------"
          );
          console.log("Bridge success!!! :)");
        } catch (err) {
          console.log(err);
          console.log("Bridge failed!!! :(");
        }
      }
    }
  );
}

main();
