import { ethers } from "ethers";
import PopupMessage from "./PopupMessage";
import React, { useState, useEffect } from "react";
const PurchaseTokens = ({ state }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const purchaseTokens = async (event) => {
    event.preventDefault();
    const { signer, contract } = state;

    const tx = await contract.isWhitelisted(await signer.getAddress());
    console.log(tx);
    setErrorMessage(true);

    const amount = document.querySelector("#amountOfTokens").value;
    console.log("Requested amount:", amount);
    const balanceOfTokensBefore = await contract.balanceOf(
      await signer.getAddress()
    );
    console.log(
      `Token balance of user ${await signer.getAddress()} before purchase is ${balanceOfTokensBefore}`
    );
    const amountOfTokens = ethers.utils.parseEther(amount);
    console.log("Parsed amount:", parseInt(amountOfTokens));
    const price = ethers.utils.parseEther("0.0001");
    const valueToSend = amount * price;
    const transaction = await contract.purchaseTokens(amountOfTokens, {
      value: valueToSend,
    });
    await transaction.wait();
    console.log(transaction);
    console.log("Transaction is done", transaction);
    const balanceOfTokens = await contract.balanceOf(await signer.getAddress());
    console.log(
      `Token balance of user ${await signer.getAddress()} after purchase is ${balanceOfTokens}`
    );
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div
        className="container-md"
        style={{ width: "39%", marginTop: "-455px", marginLeft: "750px" }}
      >
        <form onSubmit={purchaseTokens}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Enter amount of tokens. Price (1 XALTS = 0.0001 ETH = ~ $ 0.18)
            </label>
            <input
              type="text"
              className="form-control"
              id="amountOfTokens"
              placeholder="Enter amount"
            />
          </div>
          <div style={{ color: "red" }}>
            {!errorMessage
              ? " "
              : "Only whitelisted wallet can purchase XALTS tokens."}
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={!state.contract}
          >
            Purchase XALTS Token
          </button>
          {showPopup && (
            <PopupMessage
              message="Purchase Successful"
              onClose={handleClosePopup}
            />
          )}
        </form>
      </div>
      <p></p>
    </>
  );
};

export default PurchaseTokens;
