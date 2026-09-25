import { UserRole } from '@/types';

/**
 * Cyber Security Input Sanitization
 * Strips script tags, HTML event handlers, and restricts length to protect against XSS and injection
 */
export function sanitizeInput(input: string, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'))
    .trim()
    .slice(0, maxLength);
}

/**
 * In-Memory Rate Limiting per IP/Identifier
 * Protects against brute-force code guessing and API flooding
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfterSeconds: 0,
  };
}

/**
 * RBAC Role Permission Checker
 */
export function hasRequiredRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Cryptographic Random Nonce
 */
export function generateSecurityNonce(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Security Audit Logger
 */
export function recordSecurityAudit(
  action: string,
  actorUid: string,
  details: Record<string, unknown>
) {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    actorUid,
    details,
  };

  if (process.env.NODE_ENV !== 'production') {
    // console.info('[SECURITY-AUDIT]', auditEntry);
  }

  // Stored in secure audit log buffer if in client
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('nota_security_audit_log') || '[]');
      existing.unshift(auditEntry);
      localStorage.setItem('nota_security_audit_log', JSON.stringify(existing.slice(0, 100)));
    } catch {}
  }
}
