import React from 'react';
import { useAccount } from 'wagmi';
import { useWeb3 } from '../../hooks/useWeb3';
import { SignInButton } from '../wallet/SignInButton';
import { TokenBuyModal } from '../TokenBuyModal';
import { useToast } from '../ui/Toast';

interface UserDashboardProps {
  onBuyTokens: (ethAmount: string) => Promise<void>;
  onClaimDailyReward: () => Promise<void>;
}

export function UserDashboard({ onBuyTokens, onClaimDailyReward }: UserDashboardProps) {
  const { address, isConnected } = useAccount();
  const { playerStats, tokenPriceInfo, isLoading } = useWeb3();
  const { addToast } = useToast();
  const [showBuyModal, setShowBuyModal] = React.useState(false);

  const handleBuyTokens = async (ethAmount: string) => {
    try {
      await onBuyTokens(ethAmount);
      addToast({
        type: 'success',
        message: 'Tokens purchased successfully!',
      });
      setShowBuyModal(false);
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to purchase tokens. Please try again.',
      });
    }
  };

  const handleClaimDailyReward = async () => {
    try {
      await onClaimDailyReward();
      addToast({
        type: 'success',
        message: 'Daily reward claimed successfully!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to claim daily reward. Please try again.',
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="glass-card" style={{
        padding: 32,
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🐧</div>
        <h2 style={{ color: '#ffb347', marginBottom: 12, fontSize: 24, fontWeight: 700 }}>
          Welcome to Penguin Gaming Hub
        </h2>
        <p style={{ color: '#666', marginBottom: 24, fontSize: 16 }}>
          Connect your wallet to start playing and earning PENGU tokens!
        </p>
        <SignInButton />
      </div>
    );
  }

  return (
    <>
      <div className="glass-card" style={{
        padding: 24,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ color: '#ffb347', margin: 0, fontSize: 20, fontWeight: 700 }}>
            👤 Player Profile
          </h2>
          <div style={{
            background: '#43e97b',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {isLoading ? 'Loading...' : 'Connected'}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
            Wallet Address
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#333',
            background: 'rgba(0,0,0,0.05)',
            padding: '8px 12px',
            borderRadius: 6,
            wordBreak: 'break-all',
          }}>
            {address}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
              PENGU Balance
            </div>
            <div style={{ color: '#43e97b', fontSize: 24, fontWeight: 700 }}>
              {isLoading ? '...' : playerStats?.balance || '0'}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
              Total Score
            </div>
            <div style={{ color: '#ffb347', fontSize: 24, fontWeight: 700 }}>
              {isLoading ? '...' : playerStats?.score || '0'}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
              Daily Reward
            </div>
            <div style={{ color: '#38f9d7', fontSize: 24, fontWeight: 700 }}>
              {isLoading ? '...' : playerStats?.canClaimDaily ? 'Available' : 'Claimed'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button
            onClick={() => setShowBuyModal(true)}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#43e97b',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            💰 Buy Tokens
          </button>
          
          <button
            onClick={handleClaimDailyReward}
            disabled={isLoading || !playerStats?.canClaimDaily}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: playerStats?.canClaimDaily ? '#ffb347' : '#ccc',
              color: '#fff',
              cursor: (isLoading || !playerStats?.canClaimDaily) ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: (isLoading || !playerStats?.canClaimDaily) ? 0.6 : 1,
            }}
          >
            🎁 Claim Daily
          </button>
        </div>

        {tokenPriceInfo && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: 'rgba(67, 233, 123, 0.1)',
            borderRadius: 8,
            border: '1px solid rgba(67, 233, 123, 0.2)',
          }}>
            <div style={{ color: '#43e97b', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              💡 Token Info
            </div>
            <div style={{ color: '#666', fontSize: 12 }}>
              Price: {tokenPriceInfo.price} ETH per {tokenPriceInfo.tokensPerPurchase} PENGU
            </div>
          </div>
        )}
      </div>

      <TokenBuyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onBuyTokens={handleBuyTokens}
        isLoading={isLoading}
        tokenPriceInfo={tokenPriceInfo}
      />
    </>
  );
} 