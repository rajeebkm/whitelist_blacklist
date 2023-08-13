import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
const WhitelistBlacklist = ({ state }) => {
  const [inputValueWhitelist, setInputValueWhitelist] = useState("");
  const [inputValueBlacklist, setInputValueBlacklist] = useState("");
  const [processedArrayWhitelist, setProcessedArrayWhitelist] = useState([]);
  const [processedArrayBlacklist, setProcessedArrayBlacklist] = useState([]);
  const [walletStatus, setWalletStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChangeWhitelist = (event) => {
    setInputValueWhitelist(event.target.value);
  };

  const processInputToArrayWhitelist = () => {
    const newArray = inputValueWhitelist.split(",").map((item) => item.trim());
    setProcessedArrayWhitelist(newArray);
  };

  const handleInputChangeBlacklist = (event) => {
    setInputValueBlacklist(event.target.value);
  };

  const processInputToArrayBlacklist = () => {
    const newArray = inputValueBlacklist.split(",").map((item) => item.trim());
    setProcessedArrayBlacklist(newArray);
  };

  const whitelist = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
    // const amount = document.querySelector("#amountOfTokens").value;
    const addresses = processedArrayWhitelist;
    const transaction = await contract.whitelist(addresses);
    await transaction.wait();
    console.log(transaction);
    console.log("Transaction is done", transaction);
  };

  const blacklist = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
    // const amount = document.querySelector("#amountOfTokens").value;
    const addresses = processedArrayBlacklist;
    const transaction = await contract.blacklist(addresses);
    await transaction.wait();
    console.log(transaction);
    console.log("Transaction is done", transaction);
  };

  const checkWalletStatus = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
    const wallet = document.querySelector("#wallet").value;
    const isValidAddress = ethers.utils.isAddress(wallet);
    if (isValidAddress) {
      const transaction = await contract.isWhitelisted(wallet);
      await transaction.wait();
      console.log(transaction);
      setWalletStatus(transaction);
      setErrorMessage(false);
      console.log("Transaction is done", transaction);
    } else {
      console.log("Please enter an valid ethereum address");
      setErrorMessage(true);
    }
  };
  return (
    <>
      <div className="container-md" style={{ width: "50%", marginTop: "25px" }}>
        <form onSubmit={whitelist}>
          <div className="mb-3">
            <label className="form-label">Addresses to whitelist</label>
            <input
              type="text"
              value={inputValueWhitelist}
              onChange={handleInputChangeWhitelist}
              className="form-control"
              placeholder="Enter Addresses"
            />
          </div>
          <button
            onClick={processInputToArrayWhitelist}
            type="submit"
            className="btn btn-primary"
            disabled={!state.contract}
          >
            Whitelist
          </button>
        </form>
        <form onSubmit={blacklist}>
          <div className="mb-3">
            <label className="form-label">Addresses to Blacklist</label>
            <input
              type="text"
              value={inputValueBlacklist}
              onChange={handleInputChangeBlacklist}
              className="form-control"
              placeholder="Enter Addresses"
            />
          </div>
          <button
            onClick={processInputToArrayWhitelist}
            type="submit"
            className="btn btn-danger"
            disabled={!state.contract}
          >
            Blacklist
          </button>
        </form>
        <form onSubmit={checkWalletStatus}>
          <div className="mb-3">
            <label className="form-label">Check Wallet Status</label>
            <input
              type="text"
              className="form-control"
              id="wallet"
              placeholder="Enter wallet address"
            />
          </div>
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={!state.contract}
          >
            Check Status
          </button>
        </form>
      </div>
      <p></p>
    </>
  );
};
export default WhitelistBlacklist;
