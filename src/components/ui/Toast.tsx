import React, { useState, useEffect } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      top: 20,
      right: 20,
      padding: '12px 20px',
      borderRadius: 8,
      color: '#fff',
      fontWeight: 600,
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      maxWidth: 300,
      animation: 'slideIn 0.3s ease-out',
    };

    switch (toast.type) {
      case 'success':
        return { ...baseStyle, background: '#43e97b' };
      case 'error':
        return { ...baseStyle, background: '#ff6b6b' };
      case 'warning':
        return { ...baseStyle, background: '#ffb347' };
      case 'info':
        return { ...baseStyle, background: '#38f9d7' };
      default:
        return { ...baseStyle, background: '#666' };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <div style={getToastStyle()}>
      <span>{getIcon()}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 16,
          marginLeft: 'auto',
          opacity: 0.7,
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000 }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );

  return { addToast, removeToast, ToastContainer };
} 