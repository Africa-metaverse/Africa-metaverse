const { ethers } = require("hardhat");

async function main() {
  console.log("🌾 Deploying Crypto Harvest Token...");

  // Get the contract factory
  const HarvestToken = await ethers.getContractFactory("HarvestToken");
  
  // Deploy the contract
  const harvestToken = await HarvestToken.deploy();
  
  // Wait for deployment to finish
  await harvestToken.waitForDeployment();
  
  const address = await harvestToken.getAddress();
  
  console.log("✅ Harvest Token deployed to:", address);
  console.log("📋 Contract Details:");
  console.log("   - Name: Harvest Token");
  console.log("   - Symbol: HARVEST");
  console.log("   - Initial Supply: 1,000,000 HARVEST");
  console.log("   - Planting Cost: 5 HARVEST");
  console.log("   - Harvest Reward: 10 HARVEST");
  console.log("   - Growth Time: 5 minutes (demo)");
  
  console.log("\n🔗 Next Steps:");
  console.log("1. Update the contract address in src/config/web3.ts");
  console.log("2. Set NEXT_PUBLIC_HARVEST_TOKEN_ADDRESS in your .env file");
  console.log("3. Run the app with: npm run dev");
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 