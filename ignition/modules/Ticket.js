const { ethers } = require("hardhat");

async function deploy() {
  const FootballTicket = await ethers.getContractFactory("FootballTicket");
  const footballTicket = await FootballTicket.deploy();

  // Wait for the contract to be deployed
  await footballTicket.deployed();

  // Now you can interact with the deployed contract
  console.log("FootballTicket deployed to:", footballTicket.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });