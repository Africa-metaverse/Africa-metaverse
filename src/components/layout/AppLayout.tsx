import React from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useToast } from '../ui/Toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { ToastContainer } = useToast();

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
      }}>
        {/* Animated Background */}
        <div className="animated-bg" />
        
        {/* Floating Geometric Elements */}
        <div className="africa-geo-bg" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 1, 
          pointerEvents: 'none', 
          opacity: 0.25 
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle cx="200" cy="200" r="80" fill="#ffb347">
              <animate attributeName="cy" values="200;700;200" dur="12s" repeatCount="indefinite" />
            </circle>
            <circle cx="1200" cy="700" r="60" fill="#43e97b">
              <animate attributeName="cy" values="700;200;700" dur="14s" repeatCount="indefinite" />
            </circle>
            <circle cx="700" cy="450" r="100" fill="#fa8bff" opacity="0.7">
              <animate attributeName="r" values="100;60;100" dur="10s" repeatCount="indefinite" />
            </circle>
            <circle cx="400" cy="800" r="40" fill="#38f9d7" opacity="0.8">
              <animate attributeName="cy" values="800;100;800" dur="16s" repeatCount="indefinite" />
            </circle>
            <circle cx="1000" cy="100" r="50" fill="#ffcc33" opacity="0.6">
              <animate attributeName="cy" values="100;800;100" dur="18s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Main Content */}
        <main style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {children}
        </main>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

// Header Component
export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header style={{
      textAlign: 'center',
      marginBottom: 40,
      padding: '20px 0',
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        color: '#fff',
        margin: 0,
        marginBottom: subtitle ? 12 : 0,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        background: 'linear-gradient(135deg, #ffb347, #43e97b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'rgba(255,255,255,0.8)',
          margin: 0,
          fontWeight: 400,
        }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}

// Footer Component
export function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '40px 20px',
      marginTop: 60,
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
    }}>
      <p style={{ margin: 0 }}>
        🐧 Built with Next.js & Abstract Chain • Powered by Web3
      </p>
    </footer>
  );
} 