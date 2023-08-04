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
  const recipient = "0xA72e562f24515C060F36A2DA07e0442899D39d2c";

  const ethTokenAddress = ethToken.address;
  const maticTokenAddress = maticToken.address;

  const ethProvider = new ethers.providers.WebSocketProvider(
    "wss://sepolia.infura.io/ws/v3/b75048e5cd284cf286c112b4373b4ccf"
  );
  const ethBridgeContract = new ethers.Contract(
    ethBridge.address,
    ethBridge.abi,
    ethProvider
  );

  const polygonProvider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, polygonProvider);
  const signer = wallet.provider.getSigner(wallet.address);

  const maticBridgeContract = new ethers.Contract(
    maticBridge.address,
    maticBridge.abi,
    signer
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
          // const transactionResponse = await maticBridgeContract.mint(recipient,hre.ethers.BigNumber.from(hre.ethers.utils.parseEther(maticToBridge.toString())));
          console.log(maticToBridge);

          // https://docs.ethers.io/v5/api/signer/#Signer-populateTransaction
          let unsignedTx = await maticBridgeContract.populateTransaction.mint(
            recipient,
            ethers.utils
              .parseUnits(maticToBridge.toString(), "ether")
              .toString(),
            info.nonce
          );

          const txResponse = await signer.sendTransaction(unsignedTx);
          await txResponse.wait(1);
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
