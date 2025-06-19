/**
 * Web-compatible hashing utility using Web Crypto API
 * Replaces Node.js crypto module usage
 */

export async function hashString(input: string): Promise<string> {
  // Use Web Crypto API instead of Node.js crypto
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateIPHash(ip: string, bookId: string | number): Promise<string> {
  return hashString(`${ip}-${bookId}`);
}
