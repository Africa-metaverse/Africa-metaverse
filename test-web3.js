#!/usr/bin/env node

const { createPublicClient, http, parseEther, formatEther } = require('viem');
const { abstractMainnet } = require('./src/config/chains.ts');

// Test configuration
const PENGU_TOKEN_ADDRESS = '0x9ebe3a824ca958e4b3da772d2065518f009cba62';
const TEST_WALLET = '0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f';

// Simplified ABI for testing
const PENGU_TOKEN_ABI = [
  {
    "inputs": [{"type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function testWeb3Integration() {
  console.log('🐧 Testing Penguin Gaming Hub Web3 Integration...\n');

  try {
    // Create public client
    const client = createPublicClient({
      chain: abstractMainnet,
      transport: http('https://api.mainnet.abs.xyz'),
    });

    console.log('✅ Connected to Abstract mainnet');
    console.log(`📡 RPC URL: https://api.mainnet.abs.xyz`);
    console.log(`🔗 Chain ID: ${abstractMainnet.id}\n`);

    // Test token contract
    console.log('🔍 Testing PENGU Token Contract...');
    
    // Get token name
    const tokenName = await client.readContract({
      address: PENGU_TOKEN_ADDRESS,
      abi: PENGU_TOKEN_ABI,
      functionName: 'name',
    });
    console.log(`✅ Token Name: ${tokenName}`);

    // Get token symbol
    const tokenSymbol = await client.readContract({
      address: PENGU_TOKEN_ADDRESS,
      abi: PENGU_TOKEN_ABI,
      functionName: 'symbol',
    });
    console.log(`✅ Token Symbol: ${tokenSymbol}`);

    // Get total supply
    const totalSupply = await client.readContract({
      address: PENGU_TOKEN_ADDRESS,
      abi: PENGU_TOKEN_ABI,
      functionName: 'totalSupply',
    });
    console.log(`✅ Total Supply: ${formatEther(totalSupply)} ${tokenSymbol}`);

    // Get test wallet balance
    const balance = await client.readContract({
      address: PENGU_TOKEN_ADDRESS,
      abi: PENGU_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [TEST_WALLET],
    });
    console.log(`✅ Test Wallet Balance: ${formatEther(balance)} ${tokenSymbol}`);

    // Test network connectivity
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ Latest Block: ${blockNumber}`);

    console.log('\n🎉 All Web3 tests passed!');
    console.log('\n📋 Ready for real token testing:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Connect your Abstract Wallet');
    console.log('3. Switch to Abstract mainnet (Chain ID: 2741)');
    console.log('4. Test real PENGU token interactions');

  } catch (error) {
    console.error('❌ Web3 test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check internet connection');
    console.log('2. Verify Abstract mainnet RPC is accessible');
    console.log('3. Ensure token contract is deployed');
  }
}

// Run the test
testWeb3Integration(); 