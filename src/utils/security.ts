// Security utilities for input validation and sanitization

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

// Input validation patterns
const PATTERNS = {
  ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  ETH_PRIVATE_KEY: /^0x[a-fA-F0-9]{64}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^[0-9]+(\.[0-9]+)?$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  GAME_NAME: /^[a-zA-Z0-9\s\-_]{1,50}$/,
} as const;

// XSS prevention - HTML entity encoding
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// XSS prevention - Remove dangerous characters
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate Ethereum address
export function validateEthAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Invalid address format' };
  }

  const cleanAddress = address.trim();
  
  if (!PATTERNS.ETH_ADDRESS.test(cleanAddress)) {
    return { isValid: false, error: 'Invalid Ethereum address format' };
  }

  return { 
    isValid: true, 
    sanitizedValue: cleanAddress.toLowerCase() 
  };
}

// Validate numeric input
export function validateNumeric(value: string, min?: number, max?: number): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: 'Invalid numeric value' };
  }

  const cleanValue = value.trim();
  
  if (!PATTERNS.NUMERIC.test(cleanValue)) {
    return { isValid: false, error: 'Invalid numeric format' };
  }

  const numValue = parseFloat(cleanValue);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Not a valid number' };
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { 
    isValid: true, 
    sanitizedValue: cleanValue 
  };
}

// Validate game name
export function validateGameName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Invalid game name' };
  }

  const cleanName = sanitizeInput(name.trim());
  
  if (cleanName.length === 0) {
    return { isValid: false, error: 'Game name cannot be empty' };
  }

  if (!PATTERNS.GAME_NAME.test(cleanName)) {
    return { isValid: false, error: 'Game name contains invalid characters' };
  }

  return { 
    isValid: true, 
    sanitizedValue: cleanName 
  };
}

// Validate amount for token transfers
export function validateAmount(amount: string): ValidationResult {
  if (!amount || typeof amount !== 'string') {
    return { isValid: false, error: 'Invalid amount' };
  }

  const cleanAmount = amount.trim();
  
  if (!PATTERNS.NUMERIC.test(cleanAmount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }

  const numAmount = parseFloat(cleanAmount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Amount must be a positive number' };
  }

  if (numAmount > 1000000) {
    return { isValid: false, error: 'Amount too large' };
  }

  return { 
    isValid: true, 
    sanitizedValue: cleanAmount 
  };
}

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}

// Secure random number generation
export function secureRandom(min: number, max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % (max - min + 1));
}

// Password strength validation
export function validatePasswordStrength(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Password is too common' };
  }

  return { isValid: true };
}

// Secure hash function (for client-side)
export async function secureHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Input sanitization for forms
export function sanitizeFormData(data: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = sanitizeInput(String(value));
    }
  }
  
  return sanitized;
}

// Validate and sanitize user input
export function validateUserInput(input: unknown, type: 'address' | 'amount' | 'gameName' | 'email'): ValidationResult {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Invalid input type' };
  }

  switch (type) {
    case 'address':
      return validateEthAddress(input);
    case 'amount':
      return validateAmount(input);
    case 'gameName':
      return validateGameName(input);
    case 'email':
      if (!PATTERNS.EMAIL.test(input)) {
        return { isValid: false, error: 'Invalid email format' };
      }
      return { isValid: true, sanitizedValue: input.toLowerCase() };
    default:
      return { isValid: false, error: 'Unknown validation type' };
  }
}

// Security event logging
export function logSecurityEvent(eventType: string, data: Record<string, unknown>): void {
  // In a production environment, this would send to a security monitoring service
  // For now, we'll just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY] ${eventType}:`, data);
  }
  
  // In production, you might want to send this to a security monitoring service
  // Example: await fetch('/api/security/log', { method: 'POST', body: JSON.stringify({ eventType, data }) });
}