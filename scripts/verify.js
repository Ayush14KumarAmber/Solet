const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function verify(address, constructorArgs = []) {
  try {
    await run("verify:verify", { address, constructorArguments: constructorArgs });
  } catch (e) {
    if (e.message && e.message.includes("Already Verified")) {
      console.log(`Already verified: ${address}`);
    } else {
      console.error(`Verify failed: ${address}`, e);
    }
  }
}

async function main() {
  const addressesPath = path.join(__dirname, "../deployments/addresses.json");
  if (!fs.existsSync(addressesPath)) throw new Error("No deployments/addresses.json found");
  const addrs = JSON.parse(fs.readFileSync(addressesPath));
  const network = process.env.HARDHAT_NETWORK || "sepolia";
  if (!addrs[network]) throw new Error(`No addresses for network ${network}`);
  const { VotingFactory } = addrs[network];
  await verify(VotingFactory, [process.env.VERIFY_ADMIN || undefined].filter(Boolean));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


