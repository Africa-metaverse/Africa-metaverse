import React, { useEffect, useState } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export function AccessibilityEnhancer() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  });

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--foreground', '#ffffff');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
    }

    if (settings.largeText) {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.1s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }
  }, [settings]);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      zIndex: 1000,
    }}>
      <button
        onClick={() => setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: 'none',
          background: settings.highContrast ? '#43e97b' : '#ccc',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 12,
          marginBottom: 8,
        }}
        aria-label="Toggle high contrast mode"
      >
        {settings.highContrast ? '🌙' : '☀️'} Contrast
      </button>
      
      <button
        onClick={() => setSettings(prev => ({ ...prev, largeText: !prev.largeText }))}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: 'none',
          background: settings.largeText ? '#43e97b' : '#ccc',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 12,
          marginBottom: 8,
        }}
        aria-label="Toggle large text mode"
      >
        {settings.largeText ? '🔍' : '🔎'} Text Size
      </button>
      
      <button
        onClick={() => setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: 'none',
          background: settings.reducedMotion ? '#43e97b' : '#ccc',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 12,
        }}
        aria-label="Toggle reduced motion mode"
      >
        {settings.reducedMotion ? '⏸️' : '▶️'} Motion
      </button>
    </div>
  );
}

// Accessible button component
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        padding: '12px 24px',
        borderRadius: 8,
        border: 'none',
        background: disabled ? '#ccc' : '#43e97b',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: 16,
        transition: 'all 0.2s ease',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Skip to main content link
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#43e97b',
        color: '#fff',
        padding: '8px 16px',
        textDecoration: 'none',
        borderRadius: 4,
        zIndex: 10000,
        fontSize: 14,
        fontWeight: 600,
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
} 