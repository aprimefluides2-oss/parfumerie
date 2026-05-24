import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminPassword } from "../../lib/auth.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
  const { password } = req.body || {};
  if (password === getAdminPassword()) return res.json({ ok: true });
  return res.status(401).json({ error: "Mot de passe incorrect." });
}
