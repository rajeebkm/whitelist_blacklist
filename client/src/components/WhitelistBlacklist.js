import { ethers } from "ethers";
import React, { useState } from "react";
const WhitelistBlacklist = ({ state }) => {
  const [inputValueWhitelist, setInputValueWhitelist] = useState("");
  const [inputValueBlacklist, setInputValueBlacklist] = useState("");
  const [processedArrayWhitelist, setProcessedArrayWhitelist] = useState([]);
  const [processedArrayBlacklist, setProcessedArrayBlacklist] = useState([]);
  const [walletStatus, setWalletStatus] = useState(null);
  const [errorMessageWhitelist, setErrorMessageWhitelist] = useState(false);
  const [errorMessageBlacklist, setErrorMessageBlacklist] = useState(false);
  const [errorMessageWalletStatus, setErrorMessageWalletStatus] =
    useState(null);
  const [enterIfScope, setEnterIfScope] = useState(false);
  const [enterIfScopeBlacklist, setEnterIfScopeBlacklist] = useState(false);
  const [enterIfScopeWhitelist, setEnterIfScopeWhitelist] = useState(false);

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
    const { signer, contract } = state;
    const tx = await contract.owner();
    console.log(tx);
    console.log(await signer.getAddress());
    const isTrue = (await signer.getAddress()) == tx;
    console.log(isTrue);
    if (isTrue) {
      const addresses = processedArrayWhitelist;
      const transaction = await contract.whitelist(addresses);
      await transaction.wait();
      console.log(transaction);
      console.log("Transaction is done", transaction);
    } else {
      setErrorMessageWhitelist(true);
      setEnterIfScopeWhitelist(true);
      console.log(enterIfScopeWhitelist);
      console.log(errorMessageWhitelist);
    }
  };

  const blacklist = async (event) => {
    event.preventDefault();
    const { signer, contract } = state;
    const tx = await contract.owner();
    console.log(tx);
    console.log(await signer.getAddress());
    const isTrue = (await signer.getAddress()) == tx;
    console.log(isTrue);
    if (isTrue) {
      const addresses = processedArrayBlacklist;
      const transaction = await contract.blacklist(addresses);
      await transaction.wait();
      console.log(transaction);
      console.log("Transaction is done", transaction);
    } else {
      setErrorMessageBlacklist(true);
      setEnterIfScopeBlacklist(true);
    }
  };

  const checkWalletStatus = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const wallet = document.querySelector("#wallet").value;
    const isValidAddress = ethers.utils.isAddress(wallet);
    if (isValidAddress) {
      const transaction = await contract.isWhitelisted(wallet);
      console.log(transaction);
      setWalletStatus(transaction);
      setErrorMessageWalletStatus(false);
      setEnterIfScope(true);
      console.log("Transaction is done", transaction);
    } else {
      console.log("Please enter an valid ethereum address");
      setErrorMessageWalletStatus(true);
    }
  };
  return (
    <>
      <div
        className="container-md"
        style={{ width: "39%", marginTop: "25px", marginRight: "650px" }}
      >
        <form onSubmit={whitelist}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Addresses to whitelist
            </label>
            <input
              type="text"
              value={inputValueWhitelist}
              onChange={handleInputChangeWhitelist}
              className="form-control"
              placeholder="Enter addresses to whitelist"
            />
          </div>
          <div style={{ color: "red" }}>
            {!errorMessageWhitelist
              ? " "
              : errorMessageWhitelist && enterIfScopeWhitelist
              ? "Only owner/issuer can blacklist."
              : " "}
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
        <form style={{ marginTop: "30px" }} onSubmit={blacklist}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Addresses to Blacklist
            </label>
            <input
              type="text"
              value={inputValueBlacklist}
              onChange={handleInputChangeBlacklist}
              className="form-control"
              placeholder="Enter addresses to blacklist"
            />
          </div>
          <div style={{ color: "red" }}>
            {!errorMessageBlacklist
              ? " "
              : errorMessageBlacklist && enterIfScopeBlacklist
              ? "Only owner/issuer can blacklist."
              : " "}
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
        <form
          style={{ marginTop: "30px", marginBottom: "30px" }}
          onSubmit={checkWalletStatus}
        >
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Check Wallet Status
            </label>
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
            {errorMessageWalletStatus
              ? "Please enter an valid ethereum address"
              : !errorMessageWalletStatus && walletStatus
              ? "Whitelisted"
              : !errorMessageWalletStatus && !walletStatus && enterIfScope
              ? "Not Whitelisted/Blacklisted"
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
