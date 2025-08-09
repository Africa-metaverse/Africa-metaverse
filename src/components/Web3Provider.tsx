'use client';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/config/web3';
import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';

const ABSTRACT_CHAIN_ID = 789; // Abstract Mainnet

const connectSounds = {
  connect: '/sounds/connect.mp3',
  disconnect: '/sounds/disconnect.mp3',
  hover: '/sounds/hover.mp3',
};

function playSound(url: string) {
  const audio = new window.Audio(url);
  audio.volume = 0.5;
  audio.play();
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [hasAbstract, setHasAbstract] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [hasWalletConnect, setHasWalletConnect] = useState(true); // Always available
  const { isConnected, address } = useAccount();
  const [status, setStatus] = useState('disconnected');
  const connectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHasAbstract(!!window.ethereum && window.ethereum.isAbstract);
    setHasMetaMask(!!window.ethereum && window.ethereum.isMetaMask);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setStatus('connected');
      playSound(connectSounds.connect);
    } else {
      setStatus('disconnected');
      playSound(connectSounds.disconnect);
    }
  }, [isConnected]);

  // Animated glow for main content
  const mainGlow = {
    boxShadow: '0 0 32px 8px var(--abs-blue), 0 0 64px 16px var(--abs-purple)',
    animation: 'glow 2.5s infinite alternate',
  };

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <div className="classic-bg" style={{ minHeight: '100vh', position: 'relative' }}>
          {/* Animated SVG background */}
          <svg className="animated-svg-bg" width="100%" height="100%" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="200" r="120" fill="#43e97b" opacity="0.18">
              <animate attributeName="cy" values="200;300;200" dur="6s" repeatCount="indefinite" />
            </circle>
            <rect x="1200" y="100" width="180" height="180" rx="40" fill="#a259ff" opacity="0.13">
              <animate attributeName="x" values="1200;1300;1200" dur="7s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="900" cy="800" rx="160" ry="80" fill="#38b6ff" opacity="0.12">
              <animate attributeName="rx" values="160;200;160" dur="8s" repeatCount="indefinite" />
            </ellipse>
          </svg>
          {/* Sparkles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="sparkle" style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 4}s`,
            }} />
          ))}
          {/* Banner */}
          <div className="animated-banner glass">
            <span role="img" aria-label="star">🌟</span> Best Experience: Use <b>Abstract Wallet</b> for instant Web3! <span role="img" aria-label="star">🌟</span>
          </div>
          {/* Connect Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {hasAbstract && (
              <button
                className="connect-btn glass animate-pop"
                ref={connectRef}
                autoFocus
                onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
                onMouseEnter={() => playSound(connectSounds.hover)}
                style={{ background: 'linear-gradient(90deg, #43e97b, #a259ff)', color: '#181a20', transition: 'box-shadow 0.3s, transform 0.2s' }}
              >
                <span role="img" aria-label="abstract">🟢</span> Sign in with Abstract
              </button>
            )}
            {hasMetaMask && (
              <button
                className="connect-btn glass animate-pop"
                onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
                onMouseEnter={() => playSound(connectSounds.hover)}
                style={{ background: 'linear-gradient(90deg, #f8ffae, #38b6ff)', color: '#181a20', transition: 'box-shadow 0.3s, transform 0.2s' }}
              >
                <span role="img" aria-label="metamask">🦊</span> Sign in with MetaMask
              </button>
            )}
            {hasWalletConnect && (
              <button
                className="connect-btn glass animate-pop"
                onClick={() => window.open('https://walletconnect.com/', '_blank')}
                onMouseEnter={() => playSound(connectSounds.hover)}
                style={{ background: 'linear-gradient(90deg, #38b6ff, #a259ff)', color: '#fff', transition: 'box-shadow 0.3s, transform 0.2s' }}
              >
                <span role="img" aria-label="walletconnect">🔗</span> Sign in with WalletConnect
              </button>
            )}
          </div>
          {/* Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', transition: 'all 0.4s cubic-bezier(.4,2,.3,1)' }}>
            <span className="status-badge glass animate-fade-in">
              {status === 'connected' ? (
                <>
                  <span role="img" aria-label="connected">✅</span> Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </>
              ) : (
                <>
                  <span role="img" aria-label="disconnected">🔌</span> Not Connected
                </>
              )}
            </span>
          </div>
          <main className="glass" style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem', zIndex: 2, position: 'relative', ...mainGlow }}>
            {children}
          </main>
        </div>
      </RainbowKitProvider>
    </WagmiProvider>
  );
} 