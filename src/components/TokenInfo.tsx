import React from 'react';
import { TOKEN_METADATA } from '../config/chains';

interface TokenInfoProps {
  balance: string;
  tokenSymbol: string;
  isConnected: boolean;
}

export function TokenInfo({ balance, tokenSymbol, isConnected }: TokenInfoProps) {
  if (!isConnected) return null;

  return (
    <div className="glass-card" style={{
      padding: 16,
      marginBottom: 16,
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🐧</span>
          <span style={{ fontWeight: 600, color: '#fff' }}>{TOKEN_METADATA.name}</span>
        </div>
        <div style={{ fontSize: 12, color: '#43e97b', fontWeight: 600 }}>
          Abstract Chain
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
            {parseFloat(balance).toLocaleString()} {tokenSymbol}
          </div>
          <div style={{ fontSize: 12, color: '#ccc', marginTop: 2 }}>
            Balance
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#43e97b' }}>
            {TOKEN_METADATA.symbol}
          </div>
          <div style={{ fontSize: 10, color: '#ccc' }}>
            Token Symbol
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: 12, 
        padding: 8, 
        background: 'rgba(67,233,123,0.1)', 
        borderRadius: 6,
        fontSize: 11,
        color: '#43e97b'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Decimals:</span>
          <span>{TOKEN_METADATA.decimals}</span>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Supply:</span>
          <span>{parseInt(TOKEN_METADATA.totalSupply) / Math.pow(10, TOKEN_METADATA.decimals)}M</span>
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Chain:</span>
          <span>Abstract</span>
        </div>
      </div>
    </div>
  );
}

export function ChainInfo() {
  return (
    <div className="glass-card" style={{
      padding: 12,
      marginBottom: 16,
      background: 'rgba(67,233,123,0.1)',
      borderRadius: 8,
      border: '1px solid rgba(67,233,123,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>🔗</span>
        <span style={{ fontWeight: 600, color: '#43e97b' }}>Abstract Chain</span>
      </div>
      <div style={{ fontSize: 11, color: '#ccc', lineHeight: 1.4 }}>
        The official blockchain for Penguin Gaming Hub. Fast, secure, and designed for gaming applications.
      </div>
      <div style={{ 
        marginTop: 8, 
        padding: 6, 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: 4,
        fontSize: 10,
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Network:</span>
          <span>Abstract</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Chain ID:</span>
          <span>1514</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Currency:</span>
          <span>ETH</span>
        </div>
      </div>
    </div>
  );
} 