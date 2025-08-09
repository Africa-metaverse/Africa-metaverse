import React from 'react';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

// React error boundary helper
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: Error }>
) {
  return function ErrorBoundaryWrapper(props: T) {
    const fallbackElement = fallback ? React.createElement(fallback, { error: new Error() }) : undefined;
    
    return (
      <ErrorBoundary fallback={fallbackElement}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Higher-order component for error handling
export function withErrorHandling<T extends object>(
  Component: React.ComponentType<T>
) {
  return function ErrorHandlingWrapper(props: T) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
} 