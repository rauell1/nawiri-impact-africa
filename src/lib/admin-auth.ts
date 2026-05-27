const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nawiri-admin-2024";

const SESSION_COOKIE_NAME = "nawiri_admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// Convert string to Uint8Array UTF-8 bytes
function textEncode(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to hex string
function hex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to get Web Crypto SubtleCrypto object in any runtime (Node.js or Edge)
function getCrypto(): SubtleCrypto {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error("Web Crypto API is not available in this environment.");
}

/** Generate a stateless, signed session token "timestamp:signature" */
export async function generateToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const subtle = getCrypto();
  const key = await subtle.importKey(
    "raw",
    textEncode(ADMIN_PASSWORD),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await subtle.sign(
    "HMAC",
    key,
    textEncode(timestamp)
  );
  const signature = hex(signatureBuffer);
  return `${timestamp}:${signature}`;
}

export function createSession(token: string): void {
  // Stateless: session is packaged completely inside the cookie
}

export async function validateSession(token: string | undefined | null): Promise<boolean> {
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
  
  try {
    // Validate cryptographic signature
    const subtle = getCrypto();
    const key = await subtle.importKey(
      "raw",
      textEncode(ADMIN_PASSWORD),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedSignatureBuffer = await subtle.sign(
      "HMAC",
      key,
      textEncode(timestamp)
    );
    const expectedSignature = hex(expectedSignatureBuffer);
    
    return signature === expectedSignature;
  } catch (error) {
    console.error("Session signature validation failed:", error);
    return false;
  }
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
