"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractMainnet } from "../config/chains";
import { useState, useEffect } from "react";

export default function AbstractWalletWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Simulate a timeout for the wallet connection
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Reduced timeout for faster loading

    return () => clearTimeout(timeout);
  }, []);

  // Always render children first, then conditionally show overlays
  return (
    <>
      {children}
      
      {/* Loading overlay */}
      {!isClient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(120deg, #ffb347 0%, #ffcc33 40%, #43e97b 100%)',
          zIndex: 9999
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid rgba(67, 233, 123, 0.2)',
              borderTop: '2px solid #43e97b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>
              Loading Penguin Gaming Hub...
            </span>
          </div>
        </div>
      )}

      {/* Abstract Wallet Provider */}
      {isClient && isLoading && (
        <AbstractWalletProvider 
          chain={abstractMainnet}
        >
          {children}
        </AbstractWalletProvider>
      )}
    </>
  );
}
