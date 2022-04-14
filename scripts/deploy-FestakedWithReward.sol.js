// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const FestakedWithReward = await hre.ethers.getContractFactory("FestakedWithReward",{
    libraries: {
      // FestakedLib: "0x4a82768Db3cB87aF402F5882566AbD31cB8d901f", // Rinkeby Lib
      FestakedLib: "0x5480516E1393D45cc1ADeD2Eb2d7fC30429E4F7f", // bscTestnet Lib
    },
  });
  const stakingContract = await FestakedWithReward.deploy(
    "Nam test Staking contract 1", //Name
    "0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83", //token address
    "0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83", //rewardTokenAddress_
    "1649840450", //stakingStarts_
    "1649926850", //stakingEnds_
    "1650018485", //withdrawStarts_
    "1650104885", //withdrawEnds_
    "80000000000000000000", //stakingCap_
    //{gasLimit: 10000000}    //rinkeby
    {gasLimit: 10000000}    //bscTestnet
    );

  await stakingContract.deployed();

  console.log("Staking contract deployed to:", stakingContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
