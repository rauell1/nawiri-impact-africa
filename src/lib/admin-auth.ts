/**
 * Nawiri Admin Authentication
 * Simple cookie-based auth for the CMS admin panel.
 * Session tokens stored in-memory (suitable for single-server prototype).
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nawiri-admin-2024";

// In-memory session store (token → createdAt)
const sessions = new Map<string, number>();

const SESSION_COOKIE_NAME = "nawiri_admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

export function createSession(token: string): void {
  sessions.set(token, Date.now());
}

export function validateSession(token: string | undefined | null): boolean {
  if (!token) return false;
  const created = sessions.get(token);
  if (!created) return false;
  if (Date.now() - created > SESSION_MAX_AGE_MS) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

/** Clean up expired sessions (call periodically) */
export function cleanupSessions(): void {
  const now = Date.now();
  for (const [token, created] of sessions) {
    if (now - created > SESSION_MAX_AGE_MS) {
      sessions.delete(token);
    }
  }
}
