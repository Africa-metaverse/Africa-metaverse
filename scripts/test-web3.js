const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Crypto Harvest Web3 Integration...");

  try {
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();
    console.log("✅ Connected to network");

    // Deploy contract
    const HarvestToken = await ethers.getContractFactory("HarvestToken");
    const harvestToken = await HarvestToken.deploy();
    await harvestToken.waitForDeployment();
    
    const address = await harvestToken.getAddress();
    console.log("✅ Contract deployed to:", address);

    // Test basic functionality
    console.log("\n🔍 Testing Contract Functions...");

    // Check initial balance
    const ownerBalance = await harvestToken.balanceOf(owner.address);
    console.log("📊 Owner balance:", ethers.formatEther(ownerBalance), "HARVEST");

    // Transfer tokens to test user
    const transferAmount = ethers.parseEther("100");
    await harvestToken.transfer(user1.address, transferAmount);
    console.log("✅ Transferred 100 HARVEST to test user");

    // Test planting
    console.log("\n🌱 Testing Planting...");
    await harvestToken.connect(user1).plantCrop("Wheat");
    console.log("✅ Planted Wheat crop");

    // Check farm data
    const farmData = await harvestToken.getFarm(user1.address);
    console.log("📊 Farm crops:", farmData[0].length);
    console.log("📊 Total harvested:", ethers.formatEther(farmData[1]), "HARVEST");

    // Test crop data
    const cropData = await harvestToken.getCrop(1);
    console.log("🌾 Crop 1 type:", cropData[3]);
    console.log("🌾 Crop 1 planted at:", new Date(Number(cropData[0]) * 1000).toLocaleString());

    // Wait for growth (simulate time)
    console.log("\n⏰ Simulating growth time...");
    await ethers.provider.send("evm_increaseTime", [300]); // 5 minutes
    await ethers.provider.send("evm_mine");

    // Test harvesting
    console.log("\n🌾 Testing Harvesting...");
    await harvestToken.connect(user1).harvestCrop(1);
    console.log("✅ Harvested crop 1");

    // Check updated farm data
    const updatedFarmData = await harvestToken.getFarm(user1.address);
    console.log("📊 Updated total harvested:", ethers.formatEther(updatedFarmData[1]), "HARVEST");

    // Check user balance after harvest
    const userBalance = await harvestToken.balanceOf(user1.address);
    console.log("📊 User balance after harvest:", ethers.formatEther(userBalance), "HARVEST");

    console.log("\n🎉 All tests passed! Web3 integration is working correctly.");
    console.log("\n📋 Contract Details:");
    console.log("   Address:", address);
    console.log("   Owner:", owner.address);
    console.log("   Test User:", user1.address);

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }); 