import { defineChain } from 'viem';

// Abstract Mainnet Configuration
export const abstractMainnet = defineChain({
  id: 2741, // Updated to match viem's abstract chain ID
  name: 'Abstract',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet.abs.xyz'],
      webSocket: ['wss://api.mainnet.abs.xyz/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://abscan.org',
    },
    native: {
      name: 'Abstract Explorer',
      url: 'https://explorer.mainnet.abs.xyz',
    },
  },
  contracts: {
    multicall3: {
      address: '0xAa4De41dba0Ca5dCBb288b7cC6b708F3aaC759E7',
      blockCreated: 5288,
    },
    universalSignatureVerifier: {
      address: '0xfB688330379976DA81eB64Fe4BF50d7401763B9C',
      blockCreated: 5263,
    },
  },
});

// PENGU Token Configuration
export const PENGU_TOKEN_CONFIG = {
  address: '0x9ebe3a824ca958e4b3da772d2065518f009cba62' as `0x${string}`,
  name: 'Pengu Token',
  symbol: 'PENGU',
  decimals: 18,
  chainId: 151, // Abstract mainnet
};

// Admin wallet address
export const ADMIN_WALLET = '0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f' as `0x${string}`;

// Wagmi configuration for Abstract chain
export const config = {
  chains: [abstractMainnet],
  transports: {
    [abstractMainnet.id]: {
      http: (chain: { rpcUrls: { default: { http: string[] } } }) => [chain.rpcUrls.default.http[0]],
    },
  },
};

// Token metadata
export const TOKEN_METADATA = {
  name: 'Pengu Token',
  symbol: 'PENGU',
  decimals: 18,
  description: 'The official token of Penguin Gaming Hub on Abstract chain',
  website: 'https://penguin-gaming.com',
  explorer: `https://abscan.org/token/${PENGU_TOKEN_CONFIG.address}`,
};

// Game costs in PENGU tokens
export const GAME_COSTS = {
  GAME_2048: 10,
  GAME_TICTACTOE: 5,
  GAME_RPS: 3,
  DAILY_REWARD: 200,
} as const;

// Contract addresses for different features
export const CONTRACT_ADDRESSES = {
  PENGU_TOKEN: PENGU_TOKEN_CONFIG.address,
  GAMING_HUB: "0x0000000000000000000000000000000000000000", // TODO: Add gaming hub contract
  LEADERBOARD: "0x0000000000000000000000000000000000000000", // TODO: Add leaderboard contract
  ACHIEVEMENTS: "0x0000000000000000000000000000000000000000", // TODO: Add achievements contract
} as const; 