import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
const WhitelistBlacklist = ({ state }) => {
  const [inputValueWhitelist, setInputValueWhitelist] = useState("");
  const [inputValueBlacklist, setInputValueBlacklist] = useState("");
  const [processedArrayWhitelist, setProcessedArrayWhitelist] = useState([]);
  const [processedArrayBlacklist, setProcessedArrayBlacklist] = useState([]);
  const [walletStatus, setWalletStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enterIfScope, setEnterIfScope] = useState(false);

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
    const addresses = processedArrayWhitelist;
    const transaction = await contract.whitelist(addresses);
    await transaction.wait();
    console.log(transaction);
    console.log("Transaction is done", transaction);
  };

  const blacklist = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
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
      console.log(transaction);
      setWalletStatus(transaction);
      setErrorMessage(false);
      setEnterIfScope(true);
      console.log("Transaction is done", transaction);
    } else {
      console.log("Please enter an valid ethereum address");
      setErrorMessage(true);
    }
  };
  return (
    <>
      <div
        className="container-md"
        style={{ width: "35%", marginTop: "25px", marginRight: "750px" }}
      >
        <form onSubmit={whitelist}>
          <div className="mb-3">
            <label className="form-label">Addresses to whitelist</label>
            <input
              type="text"
              value={inputValueWhitelist}
              onChange={handleInputChangeWhitelist}
              className="form-control"
              placeholder="Enter addresses to whitelist"
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
        <form style={{ marginTop: "60px" }} onSubmit={blacklist}>
          <div className="mb-3">
            <label className="form-label">Addresses to Blacklist</label>
            <input
              type="text"
              value={inputValueBlacklist}
              onChange={handleInputChangeBlacklist}
              className="form-control"
              placeholder="Enter addresses to blacklist"
            />
          </div>
          <button
            onClick={processInputToArrayBlacklist}
            type="submit"
            className="btn btn-danger"
            disabled={!state.contract}
          >
            Blacklist
          </button>
        </form>
        <form style={{ marginTop: "60px" }} onSubmit={checkWalletStatus}>
          <div className="mb-3">
            <label className="form-label">Check Wallet Status</label>
            <input
              type="text"
              className="form-control"
              id="wallet"
              placeholder="Enter wallet address"
            />
          </div>
          <div
            style={{
              color: "brown",
              marginTop: "-10px",
            }}
          >
            {errorMessage
              ? "Please enter an valid ethereum address"
              : !errorMessage && walletStatus
              ? "Whitelisted"
              : !errorMessage && !walletStatus && enterIfScope
              ? "Not Whitelisted"
              : " "}
          </div>
          <button
            style={{ marginTop: "5px" }}
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
