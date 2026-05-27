import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nawiri-admin-2024";

const SESSION_COOKIE_NAME = "nawiri_admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/** Generate a stateless, signed session token "timestamp:signature" */
export function generateToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", ADMIN_PASSWORD);
  hmac.update(timestamp);
  const signature = hmac.digest("hex");
  return `${timestamp}:${signature}`;
}

export function createSession(token: string): void {
  // Stateless: session is packaged completely inside the cookie
}

export function validateSession(token: string | undefined | null): boolean {
  if (!token) return false;
  
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  
  const [timestamp, signature] = parts;
  const timeVal = parseInt(timestamp, 10);
  if (isNaN(timeVal)) return false;
  
  // Verify token is not expired
  if (Date.now() - timeVal > SESSION_MAX_AGE_MS) {
    return false;
  }
  
  // Validate cryptographic signature
  const hmac = crypto.createHmac("sha256", ADMIN_PASSWORD);
  hmac.update(timestamp);
  const expectedSignature = hmac.digest("hex");
  
  return signature === expectedSignature;
}

export function destroySession(token: string): void {
  // Stateless: cookie clearance handles destruction
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function cleanupSessions(): void {
  // Stateless: cleanup is no longer required
}
