import { useState, useCallback, useMemo } from 'react';
import { parseEther } from 'viem';
import { 
  validateAmount, 
  validateGameName,
  RateLimiter
} from '../utils/security';
import { errorHandler } from '../utils/errorHandler';
import { ADMIN_WALLET } from '../config/chains';

// Rate limiters for different operations
const rateLimiters = {
  playGame: new RateLimiter(10, 60000), // 10 attempts per minute
  claimReward: new RateLimiter(3, 300000), // 3 attempts per 5 minutes
  buyTokens: new RateLimiter(5, 300000), // 5 attempts per 5 minutes
  transfer: new RateLimiter(20, 60000), // 20 attempts per minute
};

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

export function useSecureWeb3() {
  // Remove useAccount, use simple state for address/isConnected
  const [address] = useState<string | null>(null); // Replace with real wallet logic later
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [tokenPriceInfo, setTokenPriceInfo] = useState<TokenPriceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demo purposes - wrapped in useMemo to prevent re-creation
  const mockPlayerStats = useMemo(() => ({
    score: 1250,
    balance: "5000",
    canClaimDaily: true,
    isAdmin: address === ADMIN_WALLET,
  }), [address]);

  const mockLeaderboard: LeaderboardEntry[] = [
    { address: "0x1234...5678", score: 5000 },
    { address: "0x8765...4321", score: 3500 },
    { address: address || "0x0000...0000", score: 1250 },
  ];

  const mockAchievements: Achievement[] = [
    { id: 1, name: "First Game", description: "Play your first game", imageURI: "🎮", requiredScore: 0 },
    { id: 2, name: "Token Collector", description: "Own 1000 PENGU tokens", imageURI: "💰", requiredScore: 1000 },
    { id: 3, name: "Daily Player", description: "Claim daily reward 7 days in a row", imageURI: "📅", requiredScore: 500 },
  ];

  const mockTokenPriceInfo: TokenPriceInfo = {
    price: "0.001",
    tokensPerPurchase: "1000",
  };

  // Secure play game function with validation
  const playGameOnChain = useCallback(async (gameName: string) => {
    try {
      setIsLoading(true);
      
      // Input validation
      const gameValidation = validateGameName(gameName);
      if (!gameValidation.isValid) {
        throw new Error(gameValidation.error);
      }

      // Rate limiting
      const rateLimiter = rateLimiters.playGame;
      if (!rateLimiter.isAllowed(address || 'anonymous')) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      // Security check: validate game name
      const sanitizedGameName = gameValidation.sanitizedValue!;
      
      // Log security event
      errorHandler.logError(
        'Game play attempt',
        undefined,
        { 
          gameName: sanitizedGameName, 
          playerAddress: address,
          timestamp: new Date().toISOString()
        },
        'low'
      );

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update player stats
      setPlayerStats(prev => prev ? {
        ...prev,
        score: prev.score + Math.floor(Math.random() * 100) + 10
      } : mockPlayerStats);

    } catch (error) {
      errorHandler.logError('Game play failed', error as Error, { gameName, address });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, mockPlayerStats]);

  // Secure claim daily reward function
  const claimDailyRewardOnChain = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Rate limiting
      const rateLimiter = rateLimiters.claimReward;
      if (!rateLimiter.isAllowed(address || 'anonymous')) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      // Security check: ensure user can claim
      if (!mockPlayerStats.canClaimDaily) {
        throw new Error('Daily reward not available');
      }

      // Log security event
      errorHandler.logError(
        'Daily reward claim attempt',
        undefined,
        { 
          playerAddress: address,
          timestamp: new Date().toISOString()
        },
        'low'
      );

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update player stats
      setPlayerStats(prev => prev ? {
        ...prev,
        balance: (parseInt(prev.balance) + 100).toString(),
        canClaimDaily: false
      } : mockPlayerStats);

    } catch (error) {
      errorHandler.logError('Daily reward claim failed', error as Error, { address });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, mockPlayerStats]);

  // Secure buy tokens function
  const buyTokens = useCallback(async (ethAmount: string) => {
    try {
      setIsLoading(true);
      
      // Input validation
      const amountValidation = validateAmount(ethAmount);
      if (!amountValidation.isValid) {
        throw new Error(amountValidation.error);
      }

      // Rate limiting
      const rateLimiter = rateLimiters.buyTokens;
      if (!rateLimiter.isAllowed(address || 'anonymous')) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      const sanitizedAmount = amountValidation.sanitizedValue!;
      const amountInWei = parseEther(sanitizedAmount);

      // Security check: reasonable amount limits
      if (amountInWei > parseEther('10')) { // Max 10 ETH
        throw new Error('Amount too large for security reasons');
      }

      // Log security event
      errorHandler.logError(
        'Token purchase attempt',
        undefined,
        { 
          amount: sanitizedAmount,
          playerAddress: address,
          timestamp: new Date().toISOString()
        },
        'medium'
      );

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update player stats
      setPlayerStats(prev => prev ? {
        ...prev,
        balance: (parseInt(prev.balance) + 1000).toString()
      } : mockPlayerStats);

    } catch (error) {
      errorHandler.logError('Token purchase failed', error as Error, { ethAmount, address });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, mockPlayerStats]);

  // Secure transfer tokens function
  const transferTokens = useCallback(async (toAddress: string, amount: string) => {
    try {
      setIsLoading(true);
      
      // Input validation
      const addressValidation = validateAmount(toAddress);
      const amountValidation = validateAmount(amount);
      
      if (!addressValidation.isValid) {
        throw new Error('Invalid recipient address');
      }
      
      if (!amountValidation.isValid) {
        throw new Error(amountValidation.error);
      }

      // Rate limiting
      const rateLimiter = rateLimiters.transfer;
      if (!rateLimiter.isAllowed(address || 'anonymous')) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      const sanitizedAmount = amountValidation.sanitizedValue!;
      const amountInWei = parseEther(sanitizedAmount);

      // Security check: reasonable amount limits
      if (amountInWei > parseEther('1000000')) { // Max 1M tokens
        throw new Error('Transfer amount too large for security reasons');
      }

      // Log security event
      errorHandler.logError(
        'Token transfer attempt',
        undefined,
        { 
          toAddress,
          amount: sanitizedAmount,
          fromAddress: address,
          timestamp: new Date().toISOString()
        },
        'medium'
      );

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update player stats
      setPlayerStats(prev => prev ? {
        ...prev,
        balance: (parseInt(prev.balance) - parseInt(sanitizedAmount)).toString()
      } : mockPlayerStats);

    } catch (error) {
      errorHandler.logError('Token transfer failed', error as Error, { toAddress, amount, address });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, mockPlayerStats]);

  // Initialize with mock data
  useState(() => {
    setPlayerStats(mockPlayerStats);
    setLeaderboard(mockLeaderboard);
    setAchievements(mockAchievements);
    setTokenPriceInfo(mockTokenPriceInfo);
  });

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