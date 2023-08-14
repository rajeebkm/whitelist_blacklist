const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const walletAddresses = [
  "0x0a3fDe2364cC6e424f66cCAC482869a8ff4E5358",
  "0x5969bbe0929659b31Cf0816e381324383F9fa45b",
  "0x8508E5319f42a79329a4741654F4688Cf638917e",
  "0xd3278463d027324d9670725cf355965301e9b77d",
  "0xbb990c16433d691ce04a6962714305ee55e9aa72"
];

const leaves = walletAddresses.map((x) => keccak256(x));

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getRoot().toString("hex");

console.log("Merkle Tree: \n", tree.toString());
console.log("Merkle Root: ", "0x" + root);
const leaf = keccak256("0x5969bbe0929659b31Cf0816e381324383F9fa45b");
const proof = tree.getProof(leaf);

for (let i = 0; i < proof.length; i++) {
  console.log(
    `${i} => element position: ${
      proof[i].position
    }, & data: ${MerkleTree.bufferToHex(proof[i].data)}`
  );
}

const isValid = tree.verify(proof, leaf, root);

if (isValid) {
  console.log("✅ leaf is valid, ", isValid);
} else {
  console.log("❌ leaf is invalid, ", isValid);
}

// XALTS contract address: 0x57C3ECDD9139B421F45F1224BfD39AACed8A58aB [Sepolia Network] (https://sepolia.etherscan.io/address/0x57C3ECDD9139B421F45F1224BfD39AACed8A58aB)