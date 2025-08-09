// Security configuration and environment variables

export interface SecurityConfig {
  // API Security
  apiRateLimit: number;
  apiWindowMs: number;
  
  // Web3 Security
  maxTransactionAmount: string;
  maxDailyTransactions: number;
  allowedNetworks: string[];
  
  // Input Validation
  maxInputLength: number;
  minPasswordLength: number;
  maxPasswordLength: number;
  
  // Session Security
  sessionTimeout: number;
  maxLoginAttempts: number;
  
  // Content Security
  allowedOrigins: string[];
  allowedDomains: string[];
  
  // Feature Flags
  enableRateLimiting: boolean;
  enableInputValidation: boolean;
  enableSecurityLogging: boolean;
  enableCSRFProtection: boolean;
}

// Environment-based security configuration
export const securityConfig: SecurityConfig = {
  // API Security
  apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100'),
  apiWindowMs: parseInt(process.env.API_WINDOW_MS || '60000'),
  
  // Web3 Security
  maxTransactionAmount: process.env.MAX_TRANSACTION_AMOUNT || '10',
  maxDailyTransactions: parseInt(process.env.MAX_DAILY_TRANSACTIONS || '50'),
  allowedNetworks: (process.env.ALLOWED_NETWORKS || 'abstract,sepolia').split(','),
  
  // Input Validation
  maxInputLength: parseInt(process.env.MAX_INPUT_LENGTH || '1000'),
  minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8'),
  maxPasswordLength: parseInt(process.env.MAX_PASSWORD_LENGTH || '128'),
  
  // Session Security
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000'), // 1 hour
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
  
  // Content Security
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://yourdomain.com').split(','),
  allowedDomains: (process.env.ALLOWED_DOMAINS || 'abstract.money,yourdomain.com').split(','),
  
  // Feature Flags
  enableRateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
  enableInputValidation: process.env.ENABLE_INPUT_VALIDATION !== 'false',
  enableSecurityLogging: process.env.ENABLE_SECURITY_LOGGING !== 'false',
  enableCSRFProtection: process.env.ENABLE_CSRF_PROTECTION !== 'false',
};

// Security constants
export const SECURITY_CONSTANTS = {
  // Rate limiting
  GAME_PLAY_RATE_LIMIT: 10,
  GAME_PLAY_WINDOW_MS: 60000,
  CLAIM_REWARD_RATE_LIMIT: 3,
  CLAIM_REWARD_WINDOW_MS: 300000,
  BUY_TOKENS_RATE_LIMIT: 5,
  BUY_TOKENS_WINDOW_MS: 300000,
  TRANSFER_RATE_LIMIT: 20,
  TRANSFER_WINDOW_MS: 60000,
  
  // Input validation
  MAX_GAME_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 42,
  MAX_AMOUNT_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },
  
  // Content Security Policy
  CSP_POLICY: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://abstract.money https://*.vercel-insights.com wss://*.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  
  // Error messages (sanitized)
  ERROR_MESSAGES: {
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before trying again.',
    INVALID_INPUT: 'Invalid input provided.',
    UNAUTHORIZED: 'Unauthorized access.',
    INVALID_ADDRESS: 'Invalid Ethereum address format.',
    INVALID_AMOUNT: 'Invalid amount format.',
    INVALID_GAME_NAME: 'Invalid game name.',
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    SECURITY_VIOLATION: 'Security violation detected.',
  },
  
  // Security patterns
  PATTERNS: {
    ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
    ETH_PRIVATE_KEY: /^0x[a-fA-F0-9]{64}$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    NUMERIC: /^[0-9]+(\.[0-9]+)?$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
    GAME_NAME: /^[a-zA-Z0-9\s\-_]{1,50}$/,
  },
} as const;

// Security validation functions
export function validateSecurityConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required environment variables
  if (!process.env.NODE_ENV) {
    errors.push('NODE_ENV is required');
  }
  
  // Validate security settings
  if (securityConfig.apiRateLimit <= 0) {
    errors.push('API rate limit must be positive');
  }
  
  if (securityConfig.maxTransactionAmount && parseFloat(securityConfig.maxTransactionAmount) <= 0) {
    errors.push('Max transaction amount must be positive');
  }
  
  if (securityConfig.allowedOrigins.length === 0) {
    errors.push('At least one allowed origin is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Security utility functions
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// Security headers helper
export function getSecurityHeaders(): Record<string, string> {
  return {
    ...SECURITY_CONSTANTS.SECURITY_HEADERS,
    'Content-Security-Policy': SECURITY_CONSTANTS.CSP_POLICY,
  };
} 