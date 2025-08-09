import React, { useEffect, useState } from 'react';

interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
}

export function useMobileDetection() {
  const [mobileState, setMobileState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setMobileState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLandscape: width > height,
        screenWidth: width,
        screenHeight: height,
      });
    };

    updateMobileState();
    window.addEventListener('resize', updateMobileState);
    
    return () => window.removeEventListener('resize', updateMobileState);
  }, []);

  return mobileState;
}

// Mobile-optimized grid component
export function ResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 20,
}: {
  children: React.ReactNode;
  columns?: { mobile: number; tablet: number; desktop: number };
  gap?: number;
}) {
  const { isMobile, isTablet } = useMobileDetection();
  
  const getColumns = () => {
    if (isMobile) return columns.mobile;
    if (isTablet) return columns.tablet;
    return columns.desktop;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
      gap: gap,
      width: '100%',
    }}>
      {children}
    </div>
  );
}

// Touch-friendly button component
export function TouchButton({
  children,
  onClick,
  disabled = false,
  size = 'medium',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'medium' | 'large';
}) {
  const { isMobile } = useMobileDetection();
  
  const sizeMap = {
    small: isMobile ? 32 : 28,
    medium: isMobile ? 44 : 40,
    large: isMobile ? 56 : 48,
  };

  const buttonSize = sizeMap[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: buttonSize,
        minWidth: buttonSize,
        padding: isMobile ? '12px 20px' : '10px 16px',
        borderRadius: 8,
        border: 'none',
        background: disabled ? '#ccc' : '#43e97b',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: isMobile ? 16 : 14,
        transition: 'all 0.2s ease',
        touchAction: 'manipulation',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Mobile-optimized modal
export function MobileModal({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  const { isMobile } = useMobileDetection();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? 16 : 32,
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : 500,
        maxHeight: isMobile ? '90vh' : '80vh',
        overflow: 'auto',
        position: 'relative',
      }}>
        {title && (
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ margin: 0, color: '#ffb347', fontWeight: 700 }}>
              {title}
            </h3>
            <TouchButton
              onClick={onClose}
              size="small"
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: 24,
                padding: 0,
                minWidth: 'auto',
                minHeight: 'auto',
              }}
            >
              ×
            </TouchButton>
          </div>
        )}
        <div style={{ padding: title ? '24px' : '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Swipeable component for mobile
export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
} 