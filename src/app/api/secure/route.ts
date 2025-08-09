import { NextRequest, NextResponse } from 'next/server';
import { validateUserInput, RateLimiter, sanitizeFormData } from '../../../utils/security';

// Type definitions for secure API data
interface SecureApiData {
  address?: string;
  amount?: string;
  gameName?: string;
  input?: string;
}

// Rate limiter for API endpoints
const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Security middleware
function validateRequest(req: NextRequest): { isValid: boolean; error?: string } {
  // Check if request is from allowed origin
  const origin = req.headers.get('origin');
  const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return { isValid: false, error: 'Invalid origin' };
  }

  // Check content type for POST requests
  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { isValid: false, error: 'Invalid content type' };
    }
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  if (!apiRateLimiter.isAllowed(clientIP)) {
    return { isValid: false, error: 'Rate limit exceeded' };
  }

  return { isValid: true };
}

// Secure API route handler
export async function POST(req: NextRequest) {
  try {
    // Security validation
    const securityCheck = validateRequest(req);
    if (!securityCheck.isValid) {
      return NextResponse.json(
        { error: securityCheck.error },
        { status: 403 }
      );
    }

    // Parse and sanitize request body
    const body = await req.json();
    const sanitizedData = sanitizeFormData(body);

    // Validate required fields
    const { action, data } = sanitizedData;

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { error: 'Invalid action parameter' },
        { status: 400 }
      );
    }

    // Ensure data is an object
    const dataObj: SecureApiData = typeof data === 'object' && data !== null ? data as SecureApiData : {};

    // Handle different secure actions
    switch (action) {
      case 'validate_address':
        const addressValidation = validateUserInput(dataObj.address, 'address');
        return NextResponse.json({
          isValid: addressValidation.isValid,
          error: addressValidation.error,
          sanitizedValue: addressValidation.sanitizedValue
        });

      case 'validate_amount':
        const amountValidation = validateUserInput(dataObj.amount, 'amount');
        return NextResponse.json({
          isValid: amountValidation.isValid,
          error: amountValidation.error,
          sanitizedValue: amountValidation.sanitizedValue
        });

      case 'validate_game':
        const gameValidation = validateUserInput(dataObj.gameName, 'gameName');
        return NextResponse.json({
          isValid: gameValidation.isValid,
          error: gameValidation.error,
          sanitizedValue: gameValidation.sanitizedValue
        });

      case 'secure_hash':
        // Generate secure hash for sensitive data
        const { createHash } = await import('crypto');
        const hash = createHash('sha256').update(dataObj.input || '').digest('hex');
        return NextResponse.json({ hash });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Secure API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET(req: NextRequest) {
  // Security validation
  const securityCheck = validateRequest(req);
  if (!securityCheck.isValid) {
    return NextResponse.json(
      { error: securityCheck.error },
      { status: 403 }
    );
  }

  return NextResponse.json({
    status: 'secure',
    timestamp: new Date().toISOString(),
    rateLimitRemaining: true
  });
} 