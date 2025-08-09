import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  fps: number;
}

export function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    fps: 0,
  });

  useEffect(() => {
    // Measure page load time
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      setMetrics(prev => ({ ...prev, loadTime }));

      // Monitor memory usage
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 
        }));
      }

      // Monitor FPS
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          setMetrics(prev => ({ ...prev, fps }));
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      };
      
      requestAnimationFrame(measureFPS);
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 6,
      fontSize: 12,
      fontFamily: 'monospace',
      zIndex: 1000,
    }}>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      <div>FPS: {metrics.fps}</div>
    </div>
  );
}

// Lazy loading wrapper
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(() => 
    Promise.resolve({ default: Component })
  );

  return function LazyWrapper(props: T) {
    return (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// Image optimization component
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  ...props 
}: { src: string; alt?: string; width: number; height: number } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: 'relative', width, height }}>
      {!loaded && !error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 20,
            height: 20,
            border: '2px solid rgba(67, 233, 123, 0.2)',
            borderTop: '2px solid #43e97b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 