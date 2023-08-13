import abi from "./contracts/xalts.json";
import React, { useState, useEffect } from "react";
import PurchaseTokens from "./components/purchaseTokens.js";
import WhitelistBlacklist from "./components/WhitelistBlacklist.js";
import logo from "./logo-main.png";
import "./App.css";
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
    <div
      style={{ backgroundColor: "#EFEFEF", height: "100%", marginTop: "0px" }}
    >
      <div>
        {isConnected ? (
          <div>
            {/* <p>Connected Wallet:</p> */}
            <button
              style={{
                marginLeft: "1280px",
                marginTop: "8px",
                backgroundColor: "green",
              }}
              className="block-button"
            >
              Connected
            </button>
          </div>
        ) : (
          <button
            style={{ marginLeft: "1280px", marginTop: "8px" }}
            className="block-button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <p style={{ marginLeft: "934px", marginTop: "5px" }}>
        Account: {account}
      </p>
      <p style={{ marginLeft: "934px", marginTop: "-20px" }}>
        ETH Balance: {balance}
      </p>
      <img
        src={logo}
        width="6%"
        height="6%"
        style={{ marginLeft: "10px", marginTop: "0px" }}
      />
      <h2
        style={{
          marginLeft: "406px",
          color: "Blue",
          marginTop: "0px",
          fontSize: "35px",
        }}
      >
        XALTS Token [Whitelist/Blacklist]
      </h2>
      <div className="container">
        <WhitelistBlacklist state={state} />
        <PurchaseTokens state={state} />
      </div>
    </div>
  );
}

export default App;
