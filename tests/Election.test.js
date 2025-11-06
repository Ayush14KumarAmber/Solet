const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Election", function () {
  async function deployElectionFixture() {
    const [admin, voter1, voter2, outsider] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("VotingFactory");
    const factory = await Factory.deploy(admin.address);
    await factory.waitForDeployment();

    const now = await time.latest();
    const meta = { title: "Elec", description: "D", startTime: BigInt(now + 5), endTime: BigInt(now + 3600) };
    const tx = await factory.connect(admin).createElection(meta, 0, ethers.ZeroAddress, 0n, []);
    const receipt = await tx.wait();
    const parsed = receipt.logs.map(l => factory.interface.parseLog(l)).find(e => e && e.name === 'ElectionCreated');
    const electionAddress = parsed.args.electionAddress;
    const election = await ethers.getContractAt("Election", electionAddress);

    // add two candidates
    await election.connect(admin).addCandidates(["Alice", "Bob"], ["ipfs://a", "ipfs://b"]);
    return { election, admin, voter1, voter2, outsider, factory };
  }

  it("prevents voting before start and after end", async function () {
    const { election, voter1 } = await deployElectionFixture();
    await expect(election.connect(voter1).vote(0)).to.be.revertedWithCustomError(election, "ElectionNotActive");
    await time.increase(10);
    await expect(election.connect(voter1).vote(0)).to.emit(election, "VoteCast");
    await time.increase(4000);
    await expect(election.connect(voter1).vote(1)).to.be.revertedWithCustomError(election, "ElectionNotActive");
  });

  it("prevents double voting", async function () {
    const { election, voter1 } = await deployElectionFixture();
    await time.increase(10);
    await election.connect(voter1).vote(0);
    await expect(election.connect(voter1).vote(0)).to.be.revertedWithCustomError(election, "AlreadyVoted");
  });

  it("allowlist mode restricts voters", async function () {
    const { election, admin, voter1, outsider } = await deployElectionFixture();
    await election.connect(admin).setVotingMode(1, ethers.ZeroAddress, 0n); // Allowlist
    await election.connect(admin).setAllowlist([voter1.address], true);
    await time.increase(10);
    await expect(election.connect(outsider).vote(0)).to.be.revertedWithCustomError(election, "NotEligible");
    await expect(election.connect(voter1).vote(0)).to.emit(election, "VoteCast");
  });

  it("token-gated mode requires min balance", async function () {
    const { election, admin, voter1 } = await deployElectionFixture();

    const ERC20Mock = await ethers.getContractFactory("MockERC20");
    const token = await ERC20Mock.deploy("Mock", "MOCK");
    await token.waitForDeployment();

    await election.connect(admin).setVotingMode(2, await token.getAddress(), 100n);
    await time.increase(10);
    await expect(election.connect(voter1).vote(0)).to.be.revertedWithCustomError(election, "NotEligible");
    await token.mint(voter1.address, 100n);
    await expect(election.connect(voter1).vote(0)).to.emit(election, "VoteCast");
  });

  it("pause and close controls", async function () {
    const { election, admin, voter2 } = await deployElectionFixture();
    await election.connect(admin).pause();
    await expect(election.connect(voter2).vote(0)).to.be.revertedWithCustomError(election, "EnforcedPause");
    await election.connect(admin).unpause();
    await time.increase(10);
    await election.connect(admin).close();
    await expect(election.connect(voter2).vote(0)).to.be.revertedWithCustomError(election, "Closed");
  });
});


