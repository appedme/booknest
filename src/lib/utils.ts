import crypto from "crypto";

export function hashIP(ip: string, bookId: number): string {
  return crypto.createHash('sha256').update(ip + bookId.toString()).digest('hex');
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
}
