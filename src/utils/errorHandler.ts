export interface AppError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorHandler {
  private errors: AppError[] = [];
  private maxErrors = 100;

  logError(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
    severity: AppError['severity'] = 'medium'
  ) {
    const appError: AppError = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      stack: error?.stack,
      timestamp: new Date(),
      context,
      severity,
    };

    this.errors.push(appError);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', appError);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(appError);
    }

    return appError;
  }

  private sendToAnalytics(error: AppError) {
    // In a real app, you'd send this to your analytics service
    // For now, we'll just log it
    console.log('Sending error to analytics:', error);
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorCount() {
    return this.errors.length;
  }

  getErrorsBySeverity(severity: AppError['severity']) {
    return this.errors.filter(error => error.severity === severity);
  }
}

export const errorHandler = new ErrorHandler();

// Async error wrapper
export function withAsyncErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError(
        `Async function error${context ? ` in ${context}` : ''}`,
        error as Error,
        { args },
        'high'
      );
      throw error;
    }
  };
}

// Web3 error handler
export function handleWeb3Error(error: unknown, operation: string) {
  let message = `Web3 ${operation} failed`;
  let severity: AppError['severity'] = 'medium';

  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as { code: number }).code;
    
    if (errorCode === 4001) {
      message = 'User rejected the transaction';
      severity = 'low';
    } else if (errorCode === -32603) {
      message = 'Internal JSON-RPC error - please try again';
      severity = 'medium';
    } else if (errorCode === -32000) {
      message = 'Invalid request - please check your wallet connection';
      severity = 'high';
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message: string }).message;
    
    if (errorMessage.includes('insufficient funds')) {
      message = 'Insufficient funds for transaction';
      severity = 'medium';
    } else if (errorMessage.includes('user rejected')) {
      message = 'Transaction was rejected by user';
      severity = 'low';
    }
  }

  return errorHandler.logError(message, error as Error, { operation }, severity);
} 