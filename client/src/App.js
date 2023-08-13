import abi from "./contracts/xalts.json";
import React, { useState, useEffect } from "react";
import PurchaseTokens from "./components/purchaseTokens.js";
import WhitelistBlacklist from "./components/WhitelistBlacklist.js";
import Interactions from "./components/Interactions.js";
import logo from "./logo-main.png";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import { ethers } from "ethers";
const ethers = require("ethers");

function App() {
  const [account, setAccount] = useState("Not Connected");
  const [errorMessage, setErrorMessage] = useState(null);
  const [balance, setBalance] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [balanceXALTS, setBalanceXALTS] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountChanged", accountChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectWallet = async () => {
    const contractAddress = "0x09dcc35e2360f672D4E08C38cfE1A13A18Cf73C8";
    const contractABI = abi.abi;
    const { ethereum } = window;
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountChanged(res);

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountChanged", () => {
          window.location.reload();
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        setState({ provider, signer, contract });
        const balanceOfTokens = await contract.balanceOf(
          await signer.getAddress()
        );
        console.log(
          `Token balance of user ${await signer.getAddress()} is ${balanceOfTokens}`
        );
        setBalanceXALTS(
          parseInt(balanceOfTokens) / ethers.utils.parseEther("1")
        );
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountChanged = async (newAccount) => {
    setAccount(newAccount[0]);
    if (newAccount.length > 0) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [newAccount[0].toString(), "latest"],
        });
        setIsConnected(true);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setIsConnected(false);
      setBalance(null);
    }
  };

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
  };

  return (
    <div className="body">
      <Header />
      <div>
        {isConnected ? (
          <div>
            <button
              style={{
                marginLeft: "1298px",
                marginTop: "-55px",
                backgroundColor: "green",
              }}
              className="block-button"
            >
              Connected
            </button>
          </div>
        ) : (
          <button
            style={{ marginLeft: "1280px", marginTop: "-58px" }}
            className="block-button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <p style={{ marginLeft: "810px", marginTop: "-40px", color: "white" }}>
        Account: {account}
      </p>
      <p style={{ marginLeft: "810px", marginTop: "-20px", color: "white", marginBottom: "15px" }}>
        ETH Balance: {balance}
      </p>
      <p style={{ marginLeft: "810px", marginTop: "-20px", color: "white" }}>
        XALTS Balance: {balanceXALTS}
      </p>
      <div>
        <h2 className="title">XALTS Token [Whitelist/Blacklist]</h2>
      </div>
      <div className="container" style={{ marginTop: "50px", marginLeft: "0px" }}>
          <WhitelistBlacklist state={state} />
          <PurchaseTokens state={state} />
          <h4 style={{ marginTop: "50px", marginRight: "248px", float: "right", color: "blue" }}>Interactions with other wallet</h4>
          <Interactions state={state} />
          <p></p>
      </div>
      <Footer />
    </div>
  );
}

export default App;
