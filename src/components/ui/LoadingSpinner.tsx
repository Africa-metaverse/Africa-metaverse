import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = '#43e97b', 
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  const spinnerSize = sizeMap[size];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `2px solid rgba(67, 233, 123, 0.2)`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && (
        <span style={{
          color: '#666',
          fontSize: 14,
          fontWeight: 500,
        }}>
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 