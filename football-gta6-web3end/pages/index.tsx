import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [packType, setPackType] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const [showPackOpening, setShowPackOpening] = useState(false);

  const ADMIN_WALLET = '0166113022CB065D1C75c9c6';

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsAdmin(accounts[0].toLowerCase() === ADMIN_WALLET.toLowerCase());
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < 0.01) {
      alert('Minimum stake is 0.01H');
      return;
    }
    setIsLoading(true);
    try {
      alert('Staking feature coming soon!');
    } catch (error) {
      console.error('Staking error:', error);
      alert('Staking failed');
    }
    setIsLoading(false);
  };

  const openPack = async () => {
    setIsLoading(true);
    try {
      setShowPackOpening(true);
    } catch (error) {
      console.error('Pack opening error:', error);
      alert('Pack opening failed');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 32, width: 1200, margin: '0 auto' }}>
      <h1>Football GTA6 Web3e</h1>
      {/* Navigation */}
      <div style={{ marginBottom: 32, display: 'flex', gap: 16 }}>
        <Link href="/marketplace" style={{ padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
          Marketplace
        </Link>
        <Link href="/voting" style={{ padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
          Voting
        </Link>
        <Link href="/profile" style={{ padding: '8px 16px', background: '#ffc17', color: 'black', textDecoration: 'none', borderRadius: 4 }}>
          Profile
        </Link>
      </div>

      {!account ? (
        <button 
          onClick={connectWallet}
          style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          {isAdmin && <p style={{ color: 'gold', fontWeight: 'bold' }}>🔑 ADMIN WALLET</p>}
          
          <div style={{ marginTop: 32 }}>
            <h2>Stake ETH to Farm Tokens</h2>
            <div style={{ marginBottom: 16 }}>
              <input
                type="number"
                placeholder="ETH amount (min 0.01)"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                style={{ padding: 8, marginRight: 8 }}
              />
              <button 
                onClick={handleStake}
                disabled={isLoading}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                {isLoading ? 'Staking...' : 'Stake ETH'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2>Open Player Packs</h2>
            <div style={{ marginBottom: 16 }}>
              <select 
                value={packType}
                onChange={(e) => setPackType(e.target.value)}
                style={{ padding: 8, marginRight: 8 }}
              >
                <option value="starter">Starter Pack (10 tokens)</option>
                <option value="premium">Premium Pack (50 tokens)</option>
              </select>
              <button 
                onClick={openPack}
                disabled={isLoading}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                {isLoading ? 'Opening...' : 'Open Pack'}
              </button>
            </div>
          </div>

          {isAdmin && (
            <div style={{ marginTop: 32, padding: 16, border: '2px solid gold', borderRadius: 8 }}>
              <h2>🔑 Admin Panel</h2>
              <p>You have admin access to:</p>
              <ul>
                <li>Mint player NFTs</li>
                <li>Manage airdrops</li>
                <li>Update marketplace fees</li>
                <li>Finalize voting proposals</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Pack Opening Modal */}
      {showPackOpening && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: 'white',
            padding: 32,
            borderRadius: 16,
            maxWidth: 600,
            width: '90%',
            textAlign: 'center'
          }}>
            <h2>{packType === 'starter' ? 'Starter Pack' : 'Premium Pack'} Opening</h2>
            <p>Pack opening animation coming soon!</p>
            <button 
              onClick={() => setShowPackOpening(false)}
              style={{
                padding: '12px 24px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 