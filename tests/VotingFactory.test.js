const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingFactory", function () {
  async function deployFactoryFixture() {
    const [admin, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VotingFactory");
    const factory = await Factory.deploy(admin.address);
    await factory.waitForDeployment();
    return { factory, admin, other };
  }

  it("grants initial roles to deployer admin", async function () {
    const { factory, admin } = await deployFactoryFixture();
    const ADMIN_ROLE = await factory.ADMIN_ROLE();
    expect(await factory.hasRole(ADMIN_ROLE, admin.address)).to.eq(true);
  });

  it("only admin can create election", async function () {
    const { factory, admin, other } = await deployFactoryFixture();

    const meta = {
      title: "Test",
      description: "Desc",
      startTime: BigInt(Math.floor(Date.now() / 1000) + 5),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
    };

    const mode = 0; // Open
    await expect(
      factory.connect(other).createElection(meta, mode, ethers.ZeroAddress, 0n, [])
    ).to.be.revertedWithCustomError(factory, "NotAdmin");

    const tx = await factory
      .connect(admin)
      .createElection(meta, mode, ethers.ZeroAddress, 0n, []);
    const receipt = await tx.wait();
    const event = receipt.logs.map(l => factory.interface.parseLog(l)).find(e => e && e.name === 'ElectionCreated');
    expect(event).to.not.be.undefined;

    const count = await factory.getElectionsCount();
    expect(count).to.eq(1n);
  });

  it("pausing prevents creation", async function () {
    const { factory, admin } = await deployFactoryFixture();
    await factory.connect(admin).pause();
    const meta = {
      title: "Test",
      description: "Desc",
      startTime: BigInt(Math.floor(Date.now() / 1000) + 5),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
    };
    await expect(
      factory.connect(admin).createElection(meta, 0, ethers.ZeroAddress, 0n, [])
    ).to.be.revertedWithCustomError(factory, "EnforcedPause");
  });
});


