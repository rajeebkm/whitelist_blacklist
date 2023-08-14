import { ethers } from "ethers";
const PurchaseTokens = ({ state }) => {
  const purchaseTokens = async (event) => {
    event.preventDefault();
    const { provider, signer, contract } = state;
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
  };
  return (
    <>
      <div
        className="container-md"
        style={{ width: "39%", marginTop: "-455px", marginLeft: "675px" }}
      >
        <form onSubmit={purchaseTokens}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "14px" }}>
              Enter amount of tokens. Price (1 XLTS = 0.0001 ETH = ~ $ 0.18)
            </label>
            <input
              type="text"
              className="form-control"
              id="amountOfTokens"
              placeholder="Enter amount"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={!state.contract}
          >
            Purchase XALTS Token
          </button>
        </form>
      </div>
      <p></p>
    </>
  );
};

export default PurchaseTokens;
