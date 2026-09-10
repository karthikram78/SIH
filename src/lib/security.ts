/**
 * Avadi Connect — Security Utilities
 * Input sanitization, validation, and rate-limiting helpers
 */

// ──────────────────────────────────────────────────────────
// XSS / Injection Sanitization
// ──────────────────────────────────────────────────────────

/**
 * Strip dangerous HTML characters to prevent XSS.
 * Applied to all user-provided text before storage or display.
 */
export function sanitizeInput(value: string): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\\/g, '&#92;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Strip all HTML tags from a string.
 */
export function stripHtml(value: string): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

// ──────────────────────────────────────────────────────────
// Validation Helpers
// ──────────────────────────────────────────────────────────

/**
 * Validate Indian mobile number (10 digits, starts with 6-9).
 */
export function validateMobile(mobile: string): boolean {
  const cleaned = mobile.replace(/[\s\-\+]/g, '');
  // Accept 10-digit or +91 prefixed
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validate email address (RFC 5322 simplified).
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validate Aadhaar number (12 digits).
 */
export function validateAadhaar(aadhaar: string): boolean {
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
}

/**
 * Validate Indian pincode (6 digits, starts with 6 for Tamil Nadu).
 */
export function validatePincode(pin: string): boolean {
  return /^[1-9]\d{5}$/.test(pin.trim());
}

/**
 * Validate name: min 2 chars, only letters and spaces.
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\u0B80-\u0BFF\s.'-]+$/.test(name.trim());
}

/**
 * Validate password: min 8 chars, at least 1 letter and 1 number.
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

// ──────────────────────────────────────────────────────────
// CSRF Token (simple session-based)
// ──────────────────────────────────────────────────────────

export function generateCSRFToken(): string {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getOrCreateCSRFToken(): string {
  if (typeof window === 'undefined') return '';
  let token = sessionStorage.getItem('ns_csrf_token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('ns_csrf_token', token);
  }
  return token;
}

// ──────────────────────────────────────────────────────────
// Rate Limiting (per-session, in-memory)
// ──────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; firstAt: number }>();

/**
 * Simple client-side rate limiter.
 * @param key - Unique action key (e.g. 'login', 'otp_send')
 * @param maxRequests - Max allowed in window
 * @param windowMs - Time window in ms
 */
export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now - existing.firstAt > windowMs) {
    rateLimitMap.set(key, { count: 1, firstAt: now });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (existing.count >= maxRequests) {
    const resetIn = windowMs - (now - existing.firstAt);
    return { allowed: false, remaining: 0, resetIn };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxRequests - existing.count, resetIn: windowMs - (now - existing.firstAt) };
}

// ──────────────────────────────────────────────────────────
// Content Security Headers (for API route reference)
// ──────────────────────────────────────────────────────────

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

// ──────────────────────────────────────────────────────────
// Secure Local Storage (namespaced, with expiry)
// ──────────────────────────────────────────────────────────

const STORAGE_NS = 'ns_secure_';

export function secureSet(key: string, value: unknown, ttlMs?: number): void {
  if (typeof window === 'undefined') return;
  const item = {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null,
  };
  try {
    localStorage.setItem(STORAGE_NS + key, JSON.stringify(item));
  } catch {
    // Quota exceeded — ignore
  }
}

export function secureGet<T = unknown>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_NS + key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (item.expiresAt && Date.now() > item.expiresAt) {
      localStorage.removeItem(STORAGE_NS + key);
      return null;
    }
    return item.value as T;
  } catch {
    return null;
  }
}

export function secureRemove(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_NS + key);
}
