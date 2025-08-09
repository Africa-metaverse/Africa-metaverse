const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Abstract Mainnet Connection...");

  // Test network connection
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.abstract.money");
  
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected to Abstract Mainnet - Block:", blockNumber);
  } catch (error) {
    console.error("❌ Failed to connect to Abstract Mainnet:", error.message);
    return;
  }

  // Test PENGU token contract
  const PENGU_TOKEN_ADDRESS = "0x9ebe3a824ca958e4b3da772d2065518f009cba62";
  const PENGU_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
  ];

  try {
    const penguToken = new ethers.Contract(PENGU_TOKEN_ADDRESS, PENGU_ABI, provider);
    
    const name = await penguToken.name();
    const symbol = await penguToken.symbol();
    const decimals = await penguToken.decimals();
    const totalSupply = await penguToken.totalSupply();
    
    console.log("✅ PENGU Token Contract Verified:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    console.log("   Total Supply:", ethers.utils.formatEther(totalSupply));
    console.log("   Address:", PENGU_TOKEN_ADDRESS);
    console.log("   ABScan: https://abscan.org/token/" + PENGU_TOKEN_ADDRESS);
  } catch (error) {
    console.error("❌ Failed to verify PENGU token:", error.message);
  }

  // Test admin wallet
  const ADMIN_WALLET = "0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f";
  
  try {
    const balance = await provider.getBalance(ADMIN_WALLET);
    const penguToken = new ethers.Contract(PENGU_TOKEN_ADDRESS, PENGU_ABI, provider);
    const penguBalance = await penguToken.balanceOf(ADMIN_WALLET);
    
    console.log("✅ Admin Wallet Status:");
    console.log("   Address:", ADMIN_WALLET);
    console.log("   ABS Balance:", ethers.utils.formatEther(balance));
    console.log("   PENGU Balance:", ethers.utils.formatEther(penguBalance));
    console.log("   ABScan: https://abscan.org/address/" + ADMIN_WALLET);
  } catch (error) {
    console.error("❌ Failed to check admin wallet:", error.message);
  }

  console.log("\n🎉 Abstract Mainnet Test Complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }); 