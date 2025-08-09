import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { PENGU_TOKEN_CONFIG } from '../config/chains';

// Contract ABIs (simplified for demo)
const PENGU_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "string"}],
    "name": "playGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimDailyReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "canClaimDailyReward",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "getPlayerStats",
    "outputs": [
      {"type": "uint256"},
      {"type": "uint256"},
      {"type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}, {"type": "uint256"}],
    "name": "getLeaderboard",
    "outputs": [
      {"type": "address[]"},
      {"type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Standard ERC20 functions for real Pengu token
  {
    "inputs": [{"type": "address"}, {"type": "uint256"}],
    "name": "transfer",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
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
    "name": "decimals",
    "outputs": [{"type": "uint8"}],
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
  },
  // New functions for token buying and admin
  {
    "inputs": [],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenPriceInfo",
    "outputs": [
      {"type": "uint256"},
      {"type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "isAdmin",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "string"}],
    "name": "getGameCost",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface PlayerStats {
  score: number;
  balance: string;
  canClaimDaily: boolean;
  isAdmin: boolean;
}

export interface LeaderboardEntry {
  address: string;
  score: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  requiredScore: number;
}

export interface TokenPriceInfo {
  price: string;
  tokensPerPurchase: string;
}

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [tokenPriceInfo, setTokenPriceInfo] = useState<TokenPriceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contract reads for real Pengu token
  const { data: balance } = useReadContract({
    address: PENGU_TOKEN_CONFIG.address,
    abi: PENGU_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address },
  });

  const { data: canClaimDaily } = useReadContract({
    address: PENGU_TOKEN_CONFIG.address,
    abi: PENGU_TOKEN_ABI,
    functionName: 'canClaimDailyReward',
    args: [address],
    query: { enabled: !!address },
  });

  // Check if user is admin
  const { data: isAdmin } = useReadContract({
    address: PENGU_TOKEN_CONFIG.address,
    abi: PENGU_TOKEN_ABI,
    functionName: 'isAdmin',
    args: [address],
    query: { enabled: !!address },
  });

  // Get token price info
  const { data: priceInfo } = useReadContract({
    address: PENGU_TOKEN_CONFIG.address,
    abi: PENGU_TOKEN_ABI,
    functionName: 'getTokenPriceInfo',
    query: { enabled: !!address },
  });

  // Contract writes
  const { writeContract: writePlayGame, isPending: isPlayingGame } = useWriteContract();
  const { writeContract: writeClaimDailyReward, isPending: isClaiming } = useWriteContract();
  const { writeContract: writeTransfer } = useWriteContract();
  const { writeContract: writeBuyTokens, isPending: isBuyingTokens } = useWriteContract();

  const loadTokenPriceInfo = useCallback(async () => {
    if (!priceInfo) return;
    try {
      let price: unknown, tokensPerPurchase: unknown;
      if (Array.isArray(priceInfo)) {
        [price, tokensPerPurchase] = priceInfo;
      } else if (priceInfo && typeof priceInfo === 'object' && 'price' in priceInfo && 'tokensPerPurchase' in priceInfo) {
        price = (priceInfo as { price: unknown }).price;
        tokensPerPurchase = (priceInfo as { tokensPerPurchase: unknown }).tokensPerPurchase;
      } else {
        throw new Error('Unexpected priceInfo format');
      }
      setTokenPriceInfo({
        price: formatEther(BigInt(price as string | number | bigint)),
        tokensPerPurchase: formatEther(BigInt(tokensPerPurchase as string | number | bigint)),
      });
    } catch (error) {
      console.error('Error loading token price info:', error);
    }
  }, [priceInfo]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const mockLeaderboard: LeaderboardEntry[] = [
        { address: "0x1234...5678", score: 5000 },
        { address: "0x8765...4321", score: 3200 },
        { address: "0xabcd...efgh", score: 2800 },
        { address: address || "0x0000...0000", score: playerStats?.score || 0 },
      ];
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, [address, playerStats?.score]);

  const loadAchievements = useCallback(async () => {
    try {
      const mockAchievements: Achievement[] = [
        {
          id: 1,
          name: "First Game",
          description: "Play your first game",
          imageURI: "🏆",
          requiredScore: 1,
        },
        {
          id: 2,
          name: "Token Collector",
          description: "Accumulate 1000 tokens",
          imageURI: "💰",
          requiredScore: 10,
        },
        {
          id: 3,
          name: "Game Master",
          description: "Play 50 games",
          imageURI: "🎮",
          requiredScore: 50,
        },
      ];
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }, []);

  // Load initial data when connected
  useEffect(() => {
    if (isConnected && address) {
      loadTokenPriceInfo();
      loadLeaderboard();
      loadAchievements();
    }
  }, [isConnected, address, loadTokenPriceInfo, loadLeaderboard, loadAchievements]);

  // Update player stats when balance or admin status changes
  useEffect(() => {
    if (isConnected && address) {
      setPlayerStats({
        score: Math.floor(Math.random() * 100) + 10,
        balance: typeof balance === 'bigint' ? formatEther(balance) : "0",
        canClaimDaily: typeof canClaimDaily === 'boolean' ? canClaimDaily : false,
        isAdmin: typeof isAdmin === 'boolean' ? isAdmin : false,
      });
    }
  }, [isConnected, address, balance, canClaimDaily, isAdmin]);

  // Refresh stats after transactions complete
  useEffect(() => {
    if (!isPlayingGame && !isClaiming && !isBuyingTokens && isConnected && address) {
      const timer = setTimeout(() => {
        setPlayerStats({
          score: Math.floor(Math.random() * 100) + 10,
          balance: typeof balance === 'bigint' ? formatEther(balance) : "0",
          canClaimDaily: typeof canClaimDaily === 'boolean' ? canClaimDaily : false,
          isAdmin: typeof isAdmin === 'boolean' ? isAdmin : false,
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlayingGame, isClaiming, isBuyingTokens, isConnected, address, balance, canClaimDaily, isAdmin]);

  const playGameOnChain = async (gameName: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    try {
      setIsLoading(true);
      await writePlayGame({
        address: PENGU_TOKEN_CONFIG.address,
        abi: PENGU_TOKEN_ABI,
        functionName: 'playGame',
        args: [gameName],
      });
    } catch (error) {
      console.error('Game play error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const claimDailyRewardOnChain = async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    try {
      setIsLoading(true);
      await writeClaimDailyReward({
        address: PENGU_TOKEN_CONFIG.address,
        abi: PENGU_TOKEN_ABI,
        functionName: 'claimDailyReward',
      });
    } catch (error) {
      console.error('Claim error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const buyTokens = async (ethAmount: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    try {
      setIsLoading(true);
      const amountInWei = parseEther(ethAmount);
      await writeBuyTokens({
        address: PENGU_TOKEN_CONFIG.address,
        abi: PENGU_TOKEN_ABI,
        functionName: 'buyTokens',
        value: amountInWei,
      });
    } catch (error) {
      console.error('Buy tokens error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transferTokens = async (toAddress: string, amount: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    try {
      setIsLoading(true);
      const amountInWei = parseEther(amount);
      await writeTransfer({
        address: PENGU_TOKEN_CONFIG.address,
        abi: PENGU_TOKEN_ABI,
        functionName: 'transfer',
        args: [toAddress, amountInWei],
      });
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    playerStats,
    leaderboard,
    achievements,
    tokenPriceInfo,
    isLoading,
    playGameOnChain,
    claimDailyRewardOnChain,
    buyTokens,
    transferTokens,
  };
} 