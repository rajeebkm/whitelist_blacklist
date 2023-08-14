import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import logo from "../transfer.avif";

const Interactions = ({ state }) => {
  const [inputValue, setInputValue] = useState(null);
  const [processedArray, setProcessedArray] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const processInputToArray = () => {
    const newArray = inputValue.split(",").map((item) => item.trim());
    setProcessedArray(newArray);
  };

  const interactions = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
    const wallet = processedArray;
    const amount = document.querySelector("#amount").value;
    console.log("wallet:", wallet[0], "amount:", amount);
    const parsedAmount = ethers.utils.parseEther(amount);
    console.log("parsedAmount:", parsedAmount);
    const transaction = await contract.transfer(wallet[0], parsedAmount);
    await transaction.wait();
    console.log(transaction);
    console.log("Transaction is done", transaction);
  };

  return (
    <>
      <div
        className="container-md"
        style={{
          width: "39%",
          marginTop: "95px",
          marginLeft: "675px",
          marginBottom: "35px",
        }}
      >
        {/* <img
          src={logo}
          width="15%"
          height="30%"
          style={{
            marginLeft: "348px",
            marginTop: "-15px",
            marginBottom: "0px",
          }}
        /> */}
        <form onSubmit={interactions}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Wallet address to transfer
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="form-control"
              id="wallet"
              placeholder="Enter wallet addresses to transfer"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Amount of XALTS tokens
            </label>
            <input
              type="text"
              className="form-control"
              id="amount"
              placeholder="Enter amount of XALTS tokens to transfer"
            />
          </div>
          <button
            onClick={processInputToArray}
            type="submit"
            className="btn btn-primary"
            disabled={!state.contract}
          >
            Interactions (Transfer XALTS Tokens)
          </button>
        </form>
      </div>
    </>
  );
};
export default Interactions;
