const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ticket", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Ticket = await ethers.getContractFactory("Ticket");
    contract = await Ticket.deploy();
  });

  it("should mint a new ticket", async function () {
    const metadata = "Match 1: Team A vs Team B";
    const price = ethers.parseEther("1.0");
    await contract.mintTicket(metadata, price);
    const ticketId = await contract.getTicketCount();
    expect(await contract.getTicketOwner(ticketId)).to.equal(owner.address);
    expect(await contract.getTicketMetadata(ticketId)).to.equal(metadata);
    expect(await contract.getTicketPrice(ticketId)).to.equal(price);
    expect(await contract.isTicketForSale(ticketId)).to.be.true;
  });

  it("should not allow minting a ticket with invalid metadata", async function () {
    const metadata = "";
    const price = ethers.parseEther("1.0");
    await expect(contract.mintTicket(metadata, price)).to.be.revertedWith(
      "Invalid metadata",
    );
  });

  it("should allow buying a ticket", async function () {
    const metadata = "Match 1: Team A vs Team B";
    const price = ethers.parseEther("1.0");
    await contract.mintTicket(metadata, price);
    const ticketId = await contract.getTicketCount();
    await contract.connect(addr1).buyTicket(ticketId, { value: price });
    expect(await contract.getTicketOwner(ticketId)).to.equal(addr1.address);
    expect(await contract.isTicketForSale(ticketId)).to.be.false;
  });

  it("should not allow buying a ticket that is not for sale", async function () {
    const metadata = "Match 1: Team A vs Team B";
    const price = ethers.parseEther("1.0");
    await contract.mintTicket(metadata, price);
    const ticketId = await contract.getTicketCount();
    await contract.connect(addr1).buyTicket(ticketId, { value: price });
    await expect(
      contract.connect(addr2).buyTicket(ticketId, { value: price }),
    ).to.be.revertedWith("Ticket is not for sale");
  });

  it("should allow selling a ticket", async function () {
    const metadata = "Match 1: Team A vs Team B";
    const price = ethers.parseEther("1.0");
    await contract.mintTicket(metadata, price);
    const ticketId = await contract.getTicketCount();
    await contract.connect(addr1).buyTicket(ticketId, { value: price });
    await contract
      .connect(addr1)
      .sellTicket(ticketId, ethers.parseEther("2.0"));
    expect(await contract.getTicketPrice(ticketId)).to.equal(
      ethers.parseEther("2.0"),
    );
    expect(await contract.isTicketForSale(ticketId)).to.be.true;
  });

  it("should allow trading a ticket", async function () {
    const metadata = "Match 1: Team A vs Team B";
    const price = ethers.parseEther("1.0");
    await contract.mintTicket(metadata, price);
    const ticketId = await contract.getTicketCount();
    await contract.connect(addr1).buyTicket(ticketId, { value: price });
    await contract.connect(addr1).tradeTicket(ticketId, addr2.address);
    expect(await contract.getTicketOwner(ticketId)).to.equal(addr2.address);
  });
});
