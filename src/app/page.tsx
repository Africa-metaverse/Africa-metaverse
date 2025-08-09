'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { HARVEST_TOKEN_ABI, CONTRACT_ADDRESSES } from '@/config/web3';
import { formatEther, parseEther } from 'viem';
import { 
  Sprout, 
  Wheat, 
  Apple, 
  Carrot, 
  Grape, 
  Corn, 
  Timer, 
  Coins, 
  TrendingUp,
  Zap,
  Sun,
  Droplets
} from 'lucide-react';

interface Crop {
  id: number;
  type: string;
  plantedAt: number;
  growthTime: number;
  isHarvested: boolean;
  icon: React.ReactNode;
  color: string;
  reward: number;
}

const CROP_TYPES: Crop[] = [
  { id: 1, type: 'Wheat', plantedAt: 0, growthTime: 300, isHarvested: false, icon: <Wheat className="w-6 h-6" />, color: 'bg-yellow-400', reward: 10 },
  { id: 2, type: 'Corn', plantedAt: 0, growthTime: 600, isHarvested: false, icon: <Corn className="w-6 h-6" />, color: 'bg-orange-400', reward: 20 },
  { id: 3, type: 'Apple', plantedAt: 0, growthTime: 900, isHarvested: false, icon: <Apple className="w-6 h-6" />, color: 'bg-red-400', reward: 30 },
  { id: 4, type: 'Carrot', plantedAt: 0, growthTime: 450, isHarvested: false, icon: <Carrot className="w-6 h-6" />, color: 'bg-orange-500', reward: 15 },
  { id: 5, type: 'Grape', plantedAt: 0, growthTime: 1200, isHarvested: false, icon: <Grape className="w-6 h-6" />, color: 'bg-purple-400', reward: 40 },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [userCrops, setUserCrops] = useState<Crop[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: number]: number }>({});

  // Contract reads
  const { data: tokenBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.HARVEST_TOKEN as `0x${string}`,
    abi: HARVEST_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  });

  const { data: farmData } = useContractRead({
    address: CONTRACT_ADDRESSES.HARVEST_TOKEN as `0x${string}`,
    abi: HARVEST_TOKEN_ABI,
    functionName: 'getFarm',
    args: [address as `0x${string}`],
    enabled: !!address,
  });

  // Contract writes
  const { write: plantCrop, data: plantData } = useContractWrite({
    address: CONTRACT_ADDRESSES.HARVEST_TOKEN as `0x${string}`,
    abi: HARVEST_TOKEN_ABI,
    functionName: 'plantCrop',
  });

  const { write: harvestCrop, data: harvestData } = useContractWrite({
    address: CONTRACT_ADDRESSES.HARVEST_TOKEN as `0x${string}`,
    abi: HARVEST_TOKEN_ABI,
    functionName: 'harvestCrop',
  });

  // Wait for transactions
  const { isLoading: isPlanting } = useWaitForTransaction({
    hash: plantData?.hash,
  });

  const { isLoading: isHarvesting } = useWaitForTransaction({
    hash: harvestData?.hash,
  });

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const newTimeRemaining: { [key: number]: number } = {};
      
      userCrops.forEach(crop => {
        if (!crop.isHarvested) {
          const timeLeft = (crop.plantedAt + crop.growthTime) - now;
          newTimeRemaining[crop.id] = Math.max(0, timeLeft);
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [userCrops]);

  const handlePlantCrop = (cropType: string) => {
    if (plantCrop) {
      plantCrop({ args: [cropType] });
    }
  };

  const handleHarvestCrop = (cropId: number) => {
    if (harvestCrop) {
      harvestCrop({ args: [BigInt(cropId)] });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🌾 Crypto Harvest
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Plant, grow, and harvest digital crops to earn HARVEST tokens in this innovative DeFi farming game
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connect Your Wallet</h2>
            <ConnectButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <Sprout className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Plant Crops</h3>
              <p className="text-sm text-gray-600 mt-2">Choose from various crops with different growth times and rewards</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <Timer className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Wait & Grow</h3>
              <p className="text-sm text-gray-600 mt-2">Watch your crops grow in real-time with blockchain timestamps</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Harvest Rewards</h3>
              <p className="text-sm text-gray-600 mt-2">Collect HARVEST tokens and expand your digital farm</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🌾 Crypto Harvest
            </h1>
            <p className="text-gray-600">Welcome back, Farmer!</p>
          </div>
          <ConnectButton />
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3">
              <Coins className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">HARVEST Balance</p>
                <p className="text-xl font-semibold">
                  {tokenBalance ? formatEther(tokenBalance) : '0'} HARVEST
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3">
              <Sprout className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Crops</p>
                <p className="text-xl font-semibold">{userCrops.filter(c => !c.isHarvested).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Harvested</p>
                <p className="text-xl font-semibold">
                  {farmData ? formatEther(farmData[1]) : '0'} HARVEST
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Ready to Harvest</p>
                <p className="text-xl font-semibold">
                  {userCrops.filter(c => !c.isHarvested && timeRemaining[c.id] === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plant Crops */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Sprout className="w-6 h-6 mr-2 text-green-600" />
              Plant New Crops
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CROP_TYPES.map((crop) => (
                <div
                  key={crop.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                    selectedCrop?.id === crop.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${crop.color}`}>
                      {crop.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{crop.type}</h3>
                      <p className="text-sm text-gray-600">
                        Growth: {Math.floor(crop.growthTime / 60)}m | Reward: {crop.reward} HARVEST
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedCrop && (
              <button
                onClick={() => handlePlantCrop(selectedCrop.type)}
                disabled={isPlanting}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
              >
                {isPlanting ? 'Planting...' : `Plant ${selectedCrop.type} (5 HARVEST)`}
              </button>
            )}
          </div>

          {/* Farm Field */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Wheat className="w-6 h-6 mr-2 text-yellow-600" />
              Your Farm Field
            </h2>
            
            {userCrops.length === 0 ? (
              <div className="text-center py-12">
                <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No crops planted yet. Start farming to see your field here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userCrops.map((crop) => {
                  const isReady = !crop.isHarvested && timeRemaining[crop.id] === 0;
                  const isGrowing = !crop.isHarvested && timeRemaining[crop.id] > 0;
                  
                  return (
                    <div
                      key={crop.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isReady
                          ? 'border-green-500 bg-green-50 animate-pulse'
                          : isGrowing
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`p-3 rounded-lg ${crop.color} mx-auto w-fit mb-3`}>
                          {crop.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800">{crop.type}</h3>
                        
                        {crop.isHarvested ? (
                          <p className="text-sm text-gray-500">Harvested</p>
                        ) : isReady ? (
                          <button
                            onClick={() => handleHarvestCrop(crop.id)}
                            disabled={isHarvesting}
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {isHarvesting ? 'Harvesting...' : 'Harvest'}
                          </button>
                        ) : (
                          <div className="mt-2">
                            <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                              <Timer className="w-4 h-4" />
                              <span>{formatTime(timeRemaining[crop.id] || 0)}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{
                                  width: `${Math.max(0, 100 - ((timeRemaining[crop.id] || 0) / crop.growthTime) * 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Weather & Environment */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Sun className="w-6 h-6 mr-2 text-yellow-500" />
            Farm Environment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <Sun className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Sunshine</p>
                <p className="text-lg font-semibold text-gray-800">Optimal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <Droplets className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Moisture</p>
                <p className="text-lg font-semibold text-gray-800">Perfect</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <Sprout className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Soil Quality</p>
                <p className="text-lg font-semibold text-gray-800">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 