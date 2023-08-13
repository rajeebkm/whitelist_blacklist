import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("XALTS", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployXALTSFixture() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, otherAccount] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const name = "XALTS";
    const symbol = "XALTS";
    const price = "0.0001";
    const walletAddresses = [
      "0x0a3fDe2364cC6e424f66cCAC482869a8ff4E5358",
      "0x5969bbe0929659b31Cf0816e381324383F9fa45b",
      "0x8508E5319f42a79329a4741654F4688Cf638917e",
      "0xd3278463d027324d9670725cf355965301e9b77d",
      "0xbb990c16433d691ce04a6962714305ee55e9aa72",
    ];
    const merkleRoot =
      "0xc20533a30272aa04ee4a0b771b9bec3f908daa9e434f89c9191b8f091e8730ff";
    // const XALTS = await ethers.getContractFactory("XALTS");
    const xalts = await ethers.deployContract("XALTS", [
      name,
      symbol,
      ethers.utils.parseEther(price).toString(),
      merkleRoot,
      walletAddresses,
    ]);

    console.log(`XALTS Token contract deployed to ${xalts.target}`);

    // const token = await ethers.deployContract("XALTS");
    // console.log("Token address:", await token.getAddress());
    return { deployer, xalts, otherAccount, walletAddresses };
  }

  describe("Deployment", function () {
    it("Should set wallet addresses", async function () {
      const { deployer, xalts, otherAccount, walletAddresses } = await loadFixture(deployXALTSFixture);

      expect(await xalts.name()).to.equal("XALTS");
      expect(await xalts.symbol()).to.equal("XALTS");
      // console.log(await xalts.decimals());
      expect(parseInt(await xalts.decimals())).to.equal(18);
      expect(await xalts.owner()).to.equal(deployer.address);
      expect(parseInt(await xalts.totalSupply())).to.equal(1000000000000000000000000);
      // console.log(await xalts.walletAddressList());
      expect(parseInt((await xalts.walletAddressList())[1])).to.equal(5);
      expect(await xalts.isWhitelistedAddress(walletAddresses[0])).to.equal(true);
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });

  //   it("Should fail if the unlockTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const Lock = await ethers.getContractFactory("Lock");
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.rejectedWith(
  //       "Unlock time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
    // });
  });
});
