import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useAccount } from 'wagmi';

// Real-time Transaction Status Component
export function TransactionStatus({ hash, status }: { hash?: string; status: 'pending' | 'success' | 'error' }) {
  if (!hash) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 24px',
      borderRadius: 8,
      background: status === 'success' ? '#43e97b' : status === 'error' ? '#ff6b6b' : '#ffb347',
      color: '#fff',
      fontWeight: 600,
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      {status === 'pending' && <span>⏳</span>}
      {status === 'success' && <span>✅</span>}
      {status === 'error' && <span>❌</span>}
      <span>
        {status === 'pending' && 'Transaction pending...'}
        {status === 'success' && 'Transaction successful!'}
        {status === 'error' && 'Transaction failed'}
      </span>
      {hash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff', textDecoration: 'underline', fontSize: 12 }}
        >
          View
        </a>
      )}
    </div>
  );
}

// Real Token Transfer Modal
export function TokenTransferModal({ 
  isOpen, 
  onClose, 
  onTransfer,
  isLoading,
  balance,
  tokenSymbol
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onTransfer?: (toAddress: string, amount: string) => Promise<void>;
  isLoading?: boolean;
  balance?: string;
  tokenSymbol?: string;
}) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const { transferTokens } = useWeb3();

  const handleTransfer = async () => {
    if (!recipient || !amount) return;

    try {
      setIsTransferring(true);
      
      if (onTransfer) {
        await onTransfer(recipient, amount);
      } else {
        await transferTokens(recipient, amount);
        alert('Transfer successful!');
      }
      
      onClose();
      setRecipient('');
      setAmount('');
    } catch (error) {
      alert('Transfer failed: ' + error);
    } finally {
      setIsTransferring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="glass-card" style={{
        padding: 32,
        borderRadius: 16,
        minWidth: 400,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
      }}>
        <h3 style={{ color: '#43e97b', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
          🚀 Send {tokenSymbol || 'Pengu'} Tokens
        </h3>
        
        {balance && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 8 }}>
            <span style={{ color: '#666', fontSize: 14 }}>
              Balance: {balance} {tokenSymbol || 'PENGU'}
            </span>
          </div>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 600 }}>
            Recipient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              fontFamily: 'monospace',
            }}
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 600 }}>
            Amount ({tokenSymbol || 'PENGU'})
          </label>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#ccc',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={isTransferring || isLoading || !recipient || !amount}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: (isTransferring || isLoading) ? '#ccc' : '#43e97b',
              color: '#fff',
              cursor: (isTransferring || isLoading) ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {(isTransferring || isLoading) ? 'Transferring...' : 'Send Tokens'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Real-time Leaderboard Component
export function RealTimeLeaderboard() {
  const { leaderboard } = useWeb3();

  return (
    <div className="glass-card" style={{
      flex: 1,
      minWidth: 220,
      padding: 16,
      background: 'rgba(255,255,255,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ color: '#ffb347', fontWeight: 700, fontSize: 16, margin: 0 }}>
          🏆 Live Leaderboard
        </h3>
      </div>
      
      <div style={{ color: '#333', fontSize: 13 }}>
        {leaderboard.map((entry, index) => (
          <div
            key={entry.address}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: index < leaderboard.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
              }}>
                {index + 1}
              </span>
              <span style={{ fontFamily: 'monospace' }}>{entry.address}</span>
            </div>
            <span style={{ fontWeight: 600, color: '#43e97b' }}>
              {entry.score.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Achievements Component
export function Achievements() {
  const { achievements } = useWeb3();

  return (
    <div className="glass-card" style={{
      padding: 16,
      marginBottom: 24,
      background: 'rgba(255,255,255,0.12)',
    }}>
      <h3 style={{ color: '#fa8bff', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
        🏅 Achievements
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{achievement.imageURI}</div>
            <div style={{ fontWeight: 600, color: '#333', marginBottom: 4 }}>
              {achievement.name}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              {achievement.description}
            </div>
            <div style={{ fontSize: 10, color: '#43e97b', fontWeight: 600 }}>
              {achievement.requiredScore} games required
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Blockchain Activity Feed
export function BlockchainActivityFeed() {

  const activities = [
    { type: 'game', action: 'Played 2048', tokens: -10, timestamp: '2 min ago' },
    { type: 'reward', action: 'Claimed daily reward', tokens: 200, timestamp: '1 hour ago' },
    { type: 'transfer', action: 'Sent tokens to 0x...1234', tokens: -50, timestamp: '3 hours ago' },
    { type: 'achievement', action: 'Unlocked "First Game"', tokens: 0, timestamp: '1 day ago' },
  ];

  return (
    <div className="glass-card" style={{
      flex: 1,
      minWidth: 220,
      padding: 16,
      background: 'rgba(255,255,255,0.12)',
    }}>
      <h3 style={{ color: '#43e97b', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
        ⚡ Blockchain Activity
      </h3>
      
      <div style={{ color: '#333', fontSize: 13 }}>
        {activities.map((activity, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: index < activities.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{activity.action}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{activity.timestamp}</div>
            </div>
            <span style={{
              fontWeight: 600,
              color: activity.tokens > 0 ? '#43e97b' : activity.tokens < 0 ? '#ff6b6b' : '#666',
            }}>
              {activity.tokens > 0 ? '+' : ''}{activity.tokens} PENGU
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Network Status Component
export function NetworkStatus() {
  const { isConnected } = useAccount();

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      padding: '8px 12px',
      borderRadius: 8,
      background: isConnected ? '#43e97b' : '#ff6b6b',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: isConnected ? '#fff' : '#fff',
        animation: isConnected ? 'pulse 2s infinite' : 'none',
      }} />
      {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
} 