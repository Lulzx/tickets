require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  tasks: {
    deploy: {
      command: "node scripts/deploy",
      description: "Deploy contracts",
      run: async function (taskArguments, hre) {
        await deployContracts();
      },
    },
  },

};
