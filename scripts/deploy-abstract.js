const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Penguin Gaming Hub to Abstract Mainnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ABS");

  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    throw new Error("❌ Insufficient balance for deployment. Need at least 0.1 ABS");
  }

  // Deploy PENGU Token (if not already deployed)
  console.log("🐧 Deploying PENGU Token...");
  const PenguToken = await ethers.getContractFactory("PenguToken");
  const penguToken = await PenguToken.deploy();
  await penguToken.deployed();

  console.log("✅ PENGU Token deployed to:", penguToken.address);
  console.log("🔗 Token on ABScan: https://abscan.org/token/" + penguToken.address);

  // Deploy Gaming Hub
  console.log("🎮 Deploying Gaming Hub...");
  const GamingHub = await ethers.getContractFactory("GamingHub");
  const gamingHub = await GamingHub.deploy(penguToken.address);
  await gamingHub.deployed();

  console.log("✅ Gaming Hub deployed to:", gamingHub.address);
  console.log("🔗 Contract on ABScan: https://abscan.org/address/" + gamingHub.address);

  // Transfer ownership to admin
  const adminAddress = "0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f";
  await gamingHub.transferOwnership(adminAddress);
  console.log("👑 Ownership transferred to admin:", adminAddress);

  // Mint initial tokens to admin
  const initialSupply = ethers.utils.parseEther("1000000"); // 1M PENGU
  await penguToken.mint(adminAddress, initialSupply);
  console.log("💰 Initial supply minted to admin:", ethers.utils.formatEther(initialSupply), "PENGU");

  console.log("\n🎉 Deployment Complete!");
  console.log("📋 Summary:");
  console.log("   PENGU Token:", penguToken.address);
  console.log("   Gaming Hub:", gamingHub.address);
  console.log("   Admin:", adminAddress);
  console.log("   Network: Abstract Mainnet");
  console.log("   Explorer: https://abscan.org");

  // Save deployment info
  const deploymentInfo = {
    network: "Abstract Mainnet",
    chainId: 151,
    deployer: deployer.address,
    admin: adminAddress,
    contracts: {
      penguToken: penguToken.address,
      gamingHub: gamingHub.address,
    },
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment-abstract-mainnet.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-abstract-mainnet.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 