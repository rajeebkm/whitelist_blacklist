import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: "./envs/.env" });
// import "@nomiclabs/hardhat-ethers";
// import "@nomicfoundation/hardhat-chai-matchers";
// import "@nomicfoundation/hardhat-ethers";
// import { HardhatUserConfig } from "hardhat/config";

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const INFURA_KEY = process.env.INFURA_KEY;

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY: any = process.env.PRIVATE_KEY_SEPOLIA;
const HARDHAT_PRIVATE_KEY = process.env.PRIVATE_KEY_HARDHAT;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    localhost: {
      url: `http://127.0.0.1:8545/`,
      accounts: [HARDHAT_PRIVATE_KEY],
    },
  },
};
