const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FootballTicket", function () {
  let FootballTicket, footballTicket, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    FootballTicket = await ethers.getContractFactory("FootballTicket");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    footballTicket = await FootballTicket.deploy();
    await footballTicket.deployed();
  });

  describe("Minting", function () {
    it("Should mint a new ticket", async function () {
      await footballTicket.mintTicket("Sample Metadata", ethers.utils.parseEther("1"));
      expect(await footballTicket.getTicketCount()).to.equal(1);
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      await footballTicket.mintTicket("Sample Metadata", ethers.utils.parseEther("1"));
    });

    it("Should buy a ticket", async function () {
      const ticketId = await footballTicket.getTicketCount();
      await footballTicket.connect(addr1).buyTicket(ticketId, { value: ethers.utils.parseEther("1") });
      expect(await footballTicket.getTicketOwner(ticketId)).to.equal(addr1.address);
    });
  });

  describe("Selling", function () {
    beforeEach(async function () {
      await footballTicket.mintTicket("Sample Metadata", ethers.utils.parseEther("1"));
    });

    it("Should sell a ticket", async function () {
      const ticketId = await footballTicket.getTicketCount();
      await footballTicket.sellTicket(ticketId, ethers.utils.parseEther("2"));
      expect(await footballTicket.getTicketPrice(ticketId)).to.equal(ethers.utils.parseEther("2"));
    });
  });

  describe("Trading", function () {
    beforeEach(async function () {
      await footballTicket.mintTicket("Sample Metadata", ethers.utils.parseEther("1"));
    });

    it("Should trade a ticket", async function () {
      const ticketId = await footballTicket.getTicketCount();
      await footballTicket.tradeTicket(ticketId, addr1.address);
      expect(await footballTicket.getTicketOwner(ticketId)).to.equal(addr1.address);
    });
  });
});
