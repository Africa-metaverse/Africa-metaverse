import React, { useState } from 'react';

interface TokenBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyTokens: (ethAmount: string) => Promise<void>;
  isLoading: boolean;
  tokenPriceInfo: {
    price: string;
    tokensPerPurchase: string;
  } | null;
}

export function TokenBuyModal({ isOpen, onClose, onBuyTokens, isLoading, tokenPriceInfo }: TokenBuyModalProps) {
  const [ethAmount, setEthAmount] = useState('0.001');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleBuyTokens = async () => {
    try {
      setError('');
      const amount = parseFloat(ethAmount);
      if (amount < 0.001) {
        setError('Minimum purchase is 0.001 ETH');
        return;
      }
      if (amount % 0.001 !== 0) {
        setError('ETH amount must be multiple of 0.001');
        return;
      }
      await onBuyTokens(ethAmount);
      onClose();
    } catch {
      setError('Failed to buy tokens. Please try again.');
    }
  };

  const calculateTokens = (eth: string) => {
    const ethAmount = parseFloat(eth);
    if (isNaN(ethAmount) || ethAmount < 0.001) return 0;
    return Math.floor(ethAmount / 0.001) * 1000;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="glass-card" style={{
        padding: 32,
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#666',
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 32, marginBottom: 8, display: 'block' }}>🐧</span>
          <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 8 }}>Buy Pengu Tokens</h2>
          <p style={{ color: '#666', fontSize: 14 }}>
            Purchase tokens to play games and participate in the ecosystem
          </p>
        </div>

        {tokenPriceInfo && (
          <div style={{
            background: 'rgba(67, 233, 123, 0.1)',
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            border: '1px solid rgba(67, 233, 123, 0.3)',
          }}>
            <div style={{ fontSize: 14, color: '#43e97b', fontWeight: 600, marginBottom: 4 }}>
              Token Price: {parseFloat(tokenPriceInfo.price).toFixed(6)} ETH per {parseFloat(tokenPriceInfo.tokensPerPurchase).toLocaleString()} tokens
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Minimum purchase: 0.001 ETH
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: 8, color: '#222', fontWeight: 600 }}>
            ETH Amount:
          </label>
          <input
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            step="0.001"
            min="0.001"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.2)',
              fontSize: 16,
              background: 'rgba(255,255,255,0.9)',
            }}
            placeholder="0.001"
          />
        </div>

        <div style={{
          background: 'rgba(255, 179, 71, 0.1)',
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          border: '1px solid rgba(255, 179, 71, 0.3)',
        }}>
          <div style={{ fontSize: 14, color: '#ffb347', fontWeight: 600, marginBottom: 4 }}>
            You will receive: {calculateTokens(ethAmount).toLocaleString()} PENGU tokens
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Rate: 1000 tokens per 0.001 ETH
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: '#ff6b6b',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.2)',
              background: 'rgba(255,255,255,0.8)',
              color: '#666',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleBuyTokens}
            disabled={isLoading || parseFloat(ethAmount) < 0.001}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: isLoading || parseFloat(ethAmount) < 0.001 
                ? '#ccc' 
                : 'linear-gradient(90deg, #ffb347, #43e97b)',
              color: '#fff',
              cursor: isLoading || parseFloat(ethAmount) < 0.001 ? 'not-allowed' : 'pointer',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isLoading ? 'Processing...' : 'Buy Tokens'}
          </button>
        </div>
      </div>
    </div>
  );
} 