const { ethers, network } = require("hardhat");

// Env-driven config with sensible defaults for local testing
// REQUIRED: ADMIN_ADDRESS (defaults to deployer)
// OPTIONAL:
//   TITLE (default "Solet Election")
//   DESCRIPTION (default "")
//   START_OFFSET_SECONDS (default 60)
//   DURATION_SECONDS (default 3600)
//   MODE (0=Open,1=Allowlist,2=TokenGated) default 0
//   TOKEN_ADDRESS (required if MODE=2)
//   MIN_TOKEN_BALANCE (default 0)
//   ALLOWLIST (comma-separated addresses) -> seeds allowlist after deploy

async function main() {
  const [deployer] = await ethers.getSigners();
  const adminAddress = process.env.ADMIN_ADDRESS || deployer.address;
  const title = process.env.TITLE || "Solet Election";
  const description = process.env.DESCRIPTION || "";
  const startOffset = Number(process.env.START_OFFSET_SECONDS || 60);
  const duration = Number(process.env.DURATION_SECONDS || 3600);
  const mode = Number(process.env.MODE || 0);
  const tokenAddress = process.env.TOKEN_ADDRESS || ethers.ZeroAddress;
  const minTokenBalance = BigInt(process.env.MIN_TOKEN_BALANCE || 0);
  const allowlist = (process.env.ALLOWLIST || "").split(",").map(s => s.trim()).filter(Boolean);

  const now = Math.floor(Date.now() / 1000);
  const meta = {
    title,
    description,
    startTime: BigInt(now + startOffset),
    endTime: BigInt(now + startOffset + duration)
  };

  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Admin: ${adminAddress}`);
  console.log(`Mode: ${mode}`);

  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy(
    adminAddress,
    meta,
    mode,
    tokenAddress,
    minTokenBalance,
    deployer.address // factory placeholder
  );
  await election.waitForDeployment();
  const electionAddress = await election.getAddress();
  console.log(`Election deployed at: ${electionAddress}`);

  if (allowlist.length > 0) {
    const tx = await election.setAllowlist(allowlist, true);
    await tx.wait();
    console.log(`Allowlist seeded: ${allowlist.length} addresses`);
  }

  // Print helpful summary for frontend wiring
  console.log(JSON.stringify({
    network: network.name,
    election: electionAddress,
    admin: adminAddress,
    meta,
    mode,
    tokenAddress,
    minTokenBalance: minTokenBalance.toString()
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


