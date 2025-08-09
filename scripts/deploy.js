const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Pengu Token Contract...");

  const PenguToken = await hre.ethers.getContractFactory("PenguToken");
  const penguToken = await PenguToken.deploy();

  await penguToken.waitForDeployment();
  const address = await penguToken.getAddress();

  console.log("✅ Pengu Token deployed to:", address);
  console.log("📋 Contract Address:", address);
  console.log("🔗 Abstract Chain Explorer: https://explorer.abstract.money/address/" + address);
  
  // Verify the contract
  console.log("🔍 Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 