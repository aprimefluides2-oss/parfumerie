import type { VercelRequest, VercelResponse } from "@vercel/node";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "medhy";
}

// Auth desactivee temporairement: le back-office est librement accessible.
export function requireAdmin(_req: VercelRequest, _res: VercelResponse): boolean {
  return true;
}
