import hardhat from "hardhat";
import { ethers } from "hardhat";

async function main() {
  // Contracts are deployed using the first signer/account by default
  const [deployer] = await hardhat.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const name = "XALTS";
  const symbol = "XALTS";
  const price = "0.0001";
  const merkleRoot =
    "0xc20533a30272aa04ee4a0b771b9bec3f908daa9e434f89c9191b8f091e8730ff";
  const walletAddresses = [
    "0x0a3fDe2364cC6e424f66cCAC482869a8ff4E5358",
    "0x5969bbe0929659b31Cf0816e381324383F9fa45b",
    "0x8508E5319f42a79329a4741654F4688Cf638917e",
    "0xd3278463d027324d9670725cf355965301e9b77d",
    "0xbb990c16433d691ce04a6962714305ee55e9aa72",
  ];
  console.log("price: ", ethers.utils.parseEther(price).toString());
  const xalts = await ethers.deployContract("XALTS", [
    name,
    symbol,
    ethers.utils.parseEther(price).toString(),
    merkleRoot,
    walletAddresses,
  ]);

  await xalts.deployTransaction.wait();

  console.log("XALTS address:", xalts.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
