import type { VercelRequest, VercelResponse } from "@vercel/node";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

/**
 * Returns true when the request is authorized.
 * When unauthorized, sends a 401 response and returns false.
 */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const provided = req.headers["x-admin-password"];
  const expected = getAdminPassword();
  if (!provided || provided !== expected) {
    res.status(401).json({ error: "Mot de passe administrateur invalide." });
    return false;
  }
  return true;
}
