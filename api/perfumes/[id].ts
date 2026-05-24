import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPerfumes, setPerfumes, assertStorageReady } from "../../lib/storage.js";
import { requireAdmin } from "../../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ error: "id manquant." });

    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      assertStorageReady();
      const data = await getPerfumes();
      const idx = data.findIndex((p: any) => p.id === id);
      if (idx === -1) return res.status(404).json({ error: "Parfum introuvable." });
      data[idx] = { ...data[idx], ...req.body, id };
      await setPerfumes(data);
      return res.json(data[idx]);
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      assertStorageReady();
      const data = await getPerfumes();
      const next = data.filter((p: any) => p.id !== id);
      if (next.length === data.length) return res.status(404).json({ error: "Parfum introuvable." });
      await setPerfumes(next);
      return res.json({ ok: true });
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ error: "Méthode non autorisée." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur." });
  }
}
