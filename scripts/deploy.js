const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with: ${deployer.address} on ${network.name}`);

  const VotingFactory = await ethers.getContractFactory("VotingFactory");
  const factory = await VotingFactory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log(`VotingFactory deployed at: ${factoryAddress}`);

  // Sample election creation
  const now = Math.floor(Date.now() / 1000);
  const meta = { title: "Sample Election", description: "Solet demo", startTime: BigInt(now + 60), endTime: BigInt(now + 3600) };
  const mode = 0; // Open
  const tx = await factory.createElection(meta, mode, ethers.ZeroAddress, 0n, []);
  const rc = await tx.wait();
  const event = rc.logs.map(l => factory.interface.parseLog(l)).find(e => e && e.name === 'ElectionCreated');
  console.log(`Sample Election at: ${event.args.electionAddress}`);

  const outDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const addressesPath = path.join(outDir, "addresses.json");
  let existing = {};
  if (fs.existsSync(addressesPath)) existing = JSON.parse(fs.readFileSync(addressesPath));
  existing[network.name] = { VotingFactory: factoryAddress, SampleElection: event.args.electionAddress };
  fs.writeFileSync(addressesPath, JSON.stringify(existing, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


