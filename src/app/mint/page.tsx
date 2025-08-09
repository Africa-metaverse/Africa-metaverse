import React from "react";
import Link from "next/link";

export default function MintPage() {
  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      padding: 32,
      borderRadius: 20,
      background: 'rgba(255,255,255,0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.24)',
      position: 'relative',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: 24 }}>
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="8" width="16" height="8" rx="4" fill="#ffb347"/>
          <rect x="20" y="0" width="16" height="24" rx="8" fill="#43e97b"/>
          <rect x="40" y="8" width="16" height="8" rx="4" fill="#fa8bff"/>
          <rect x="60" y="0" width="16" height="24" rx="8" fill="#ffcc33"/>
          <rect x="80" y="8" width="16" height="8" rx="4" fill="#38f9d7"/>
          <rect x="100" y="0" width="16" height="24" rx="8" fill="#ffb347"/>
        </svg>
      </div>
      <h1 style={{ fontWeight: 800, fontSize: 28, marginBottom: 16, color: '#222' }}>Mint an NFT</h1>
      <p style={{ fontSize: 18, color: '#444', marginBottom: 24 }}>
        This is the mint page. To mint an NFT, go to the <Link href="/" style={{ color: '#43e97b', fontWeight: 700 }}>main page</Link>.
      </p>
      <div style={{ marginTop: 24 }}>
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="8" width="16" height="8" rx="4" fill="#ffb347"/>
          <rect x="20" y="0" width="16" height="24" rx="8" fill="#43e97b"/>
          <rect x="40" y="8" width="16" height="8" rx="4" fill="#fa8bff"/>
          <rect x="60" y="0" width="16" height="24" rx="8" fill="#ffcc33"/>
          <rect x="80" y="8" width="16" height="8" rx="4" fill="#38f9d7"/>
          <rect x="100" y="0" width="16" height="24" rx="8" fill="#ffb347"/>
        </svg>
      </div>
    </div>
  );
}
